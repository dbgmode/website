const webcolors = require("webcolors");
const palette = require("postcss-color-palette");
const postcssPresetEnv = require("postcss-preset-env");
const customUnits = require("@csstools/custom-units");
const reduceCalc = require("postcss-calc");

// const parseValue = require("postcss-value-parser");

// /** @type {import('postcss').PluginCreator} */
// const deMax = () => {
//   return {
//     postcssPlugin: "postcss-remove-maxes",
//     Declaration(declaration) {
//       if (!declaration || !declaration.value || !declaration.value.includes("max")) {
//         return;
//       }
//       const declarationAST = parseValue(declaration.value);

//       declarationAST.walk((node) => {
//         if (node.type !== "function" || node.value !== "max") {
//           return;
//         }

//         node.value = "calc";
//       });

//       const modifiedValue = declarationAST.toString();

//       if (declarationValue !== modifiedValue) {
//         declaration.value = modifiedValue;
//       }
//     },
//   };
// };
// deMax.postcss = true;

module.exports = {
  plugins: [
    customUnits({}),

    palette({
      palette: {
        ...webcolors.tailwind,
        fuchsia: "#fe24b7",
        red: "#f80513",
        orange: "#fe5700",
        yellow: "#fdcd1c",
        green: "#21dd16",
        aqua: "#14f4fd",
        blue: "#0f8ceb",
        purple: "#bb40bc",
        pink: "#fe23b6",
      },
    }),
    postcssPresetEnv({
      stage: 0,
      features: {
        "custom-properties": {},
      },
    }),
    reduceCalc({ preserve: false }),
  ],
};
