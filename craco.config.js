// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          // styled-system 경로 alias를 먼저 추가 (TsconfigPathsPlugin보다 우선)
          // @styled-system/css 같은 하위 경로도 처리할 수 있도록 설정
          const styledSystemPath = path.resolve(__dirname, "src/styled-system");
          webpackConfig.resolve.alias = {
            ...webpackConfig.resolve.alias,
            "@styled-system": styledSystemPath,
            "@styled-system/css": path.resolve(styledSystemPath, "css"),
            "@styled-system/tokens": path.resolve(styledSystemPath, "tokens"),
            "@styled-system/patterns": path.resolve(
              styledSystemPath,
              "patterns"
            ),
            "@styled-system/jsx": path.resolve(styledSystemPath, "jsx"),
          };

          // TsconfigPathsPlugin 설정
          const tsconfigPathsPlugin = new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, "tsconfig.json"),
            extensions: webpackConfig.resolve.extensions,
          });
          webpackConfig.resolve.plugins.push(tsconfigPathsPlugin);

          // .mjs 확장자 지원 추가 (PandaCSS가 .mjs 파일을 사용)
          if (!webpackConfig.resolve.extensions.includes(".mjs")) {
            webpackConfig.resolve.extensions.push(".mjs");
          }

          return webpackConfig;
        },
      },
    },
  ],
  // PostCSS 설정 명시적으로 추가
  style: {
    postcss: {
      mode: "extends",
      loaderOptions: {
        postcssOptions: {
          config: path.resolve(__dirname, "postcss.config.js"),
        },
      },
    },
  },
};
