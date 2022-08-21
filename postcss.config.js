const parseValue = require('postcss-value-parser');
const matchCustomNumber = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?(?=--)/;

module.exports = (_ctx) => {
  const is_dev = require('process').argv[-1] === 'dev';

  return {
    plugins: [
      require('postcss-mixins')({
        mixinsFiles: require('path').join(__dirname, 'src', 'colors.css'),
      }),
      require('postcss-simple-vars'),
      require('postcss-nested'),
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
