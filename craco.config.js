module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        {
          module: /react-datepicker/, // Suppress warnings for react-datepicker
          message: /Failed to parse source map/,
        },
      ];
      return webpackConfig;
    },
  },
};
