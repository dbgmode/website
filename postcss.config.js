const advancedVars = require("postcss-advanced-variables");
const postcssPresetEnv = require("postcss-preset-env");
const customUnits = require("@csstools/custom-units");
const reduceCalc = require("postcss-calc");

module.exports = {
  plugins: [
    advancedVars(),
    customUnits({}),
    postcssPresetEnv({
      stage: 0,
      features: {
        "custom-properties": {},
      },
    }),
    reduceCalc({ preserve: false }),
  ],
};
