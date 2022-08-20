module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  quoteProps: 'consistent',
  bracketSpacing: false,
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
