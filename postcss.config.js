module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
      minPixelValue: 2,
      mediaQuery: false,
      replace: true,
      exclude: /node_modules/i,
    },
  },
};