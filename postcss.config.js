const parseValue = require('postcss-value-parser');
const matchCustomNumber = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?(?=--)/;

module.exports = {
  plugins: [
    require('postcss-advanced-variables'),
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
    // require('postcss-custom-properties')({
    //   preserve: false,
    //   importFrom: 'src/root.css',
    // }),
    // require('@csstools/postcss-nested-calc')({preserve: false}),
    // require('postcss-calc')({preserve: false}),
    require('autoprefixer'),
  ],
};
