// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

// eslint-disable-next-line no-undef
module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          return webpackConfig;
        },
      },
    },
  ],
};
