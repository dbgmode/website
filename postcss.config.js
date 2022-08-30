const {default: postcss} = require('postcss');
const parseValue = require('postcss-value-parser');
const matchCustomNumber = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?(?=--)/;

module.exports = (_ctx) => {
  const is_dev = require('process').argv[-1] === 'dev';

  return {
    plugins: [
      require('postcss-mixins')({
        mixinsFiles: require('path').join(__dirname, 'src', 'colors.css'),
        mixins: {
          'rotating-conic-gradient-border': function (
            mixin,
            name,
            sStartAngle,
            ...colors
          ) {
            const startAngle = parseInt(sStartAngle);
            const animationName = `rotate-${name}-gradient`;

            const keyframes = postcss.atRule({
              name: 'keyframes',
              params: animationName,
            });
            const colorString = colors.join(', ');

            for (let i = 0; i <= 100; i++) {
              const deg = (startAngle + 3.6 * i) % 360;

              keyframes.append(
                postcss.rule({
                  selector: `${i}%`,
                  nodes: [
                    postcss.decl({
                      prop: 'border-image-source',
                      value: `conic-gradient(from ${deg.toFixed(
                        2
                      )}deg, ${colorString})`,
                    }),
                  ],
                })
              );
            }

            mixin.replaceWith(
              postcss.decl({
                prop: 'border-image-source',
                value: `conic-gradient(from ${startAngle}deg, ${colorString})`,
              }),
              postcss.decl({
                prop: 'animation',
                value: `7s ${animationName} infinite linear`,
              }),

              postcss.atRule({
                name: 'supports',
                params: '(background: paint(worklet))',
                nodes: [
                  postcss.atRule({
                    name: 'property',
                    params: '--angle',
                    nodes: [
                      postcss.decl({prop: 'syntax', value: "'<angle>'"}),
                      postcss.decl({prop: 'inherits', value: false}),
                      postcss.decl({prop: 'initial-value', value: '0deg'}),
                    ],
                  }),
                  postcss.decl({
                    prop: 'border-image-source',
                    value: `conic-gradient(from var(--angle), ${colorString})`,
                  }),
                  postcss.decl({
                    prop: '--angle',
                    value: `${startAngle}deg`,
                  }),
                  postcss.atRule({
                    name: 'keyframes',
                    params: `${animationName}`,
                    nodes: [
                      postcss.rule({
                        selector: 'to',
                        nodes: [
                          postcss.decl({
                            prop: '--angle',
                            value: `${startAngle + 360}deg`,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              postcss.atRule({
                name: 'supports',
                params: 'not (background: paint(worklet))',
                nodes: [keyframes],
              })
            );
          },
        },
      }),

      require('postcss-simple-vars'),
      require('postcss-nested')({unwrap: ['property']}),
      {
        postcssPlugin: 'postcss-custom-units',
        Declaration(declaration) {
          const declarationValue = declaration.value;

          if (!declarationValue.includes('--')) return;

          const declarationAST = parseValue(declarationValue);

          declarationAST.walk((node) => {
            if (node.type !== 'word') return;

            const value = (node.value.match(matchCustomNumber) || [])[0];

            if (!value) return;

            const unit = node.value.slice(value.length);

            Object.assign(node, {
              type: 'function',
              value: 'calc',
              nodes: [
                {type: 'word', value},
                {type: 'space', value: ' '},
                {type: 'word', value: '*'},
                {type: 'space', value: ' '},
                {
                  type: 'function',
                  value: 'var',
                  nodes: [{type: 'word', value: unit}],
                },
              ],
            });
          });

          const modifiedValue = declarationAST.toString();

          if (declarationValue !== modifiedValue) {
            declaration.value = modifiedValue;
          }
        },
      },
      // for de-var-ed build
      require('postcss-custom-properties')({
        preserve: is_dev,
        importFrom: 'src/root.css',
        disableDeprecationNotice: true,
      }),
      require('@csstools/postcss-nested-calc')({preserve: is_dev}),
      require('postcss-calc')({preserve: is_dev}),
      require('autoprefixer'),
    ],
  };
};
