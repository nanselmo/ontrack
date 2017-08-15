const path = require('path');

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const config = {
  entry: path.resolve(__dirname, "src", "index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  watch: true,
  watchOptions: {
    poll: true
  },
  resolve: {
    extensions: [".webpack.js", ".ts", ".tsx", ".js"],
    plugins: [
      new TsConfigPathsPlugin(path.resolve(__dirname, "tsconfig.js"))
    ],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "awesome-typescript-loader" },
      { test: /\.scss?$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  require("postcss-smart-import"),
                  require("precss"),
                  require("autoprefixer")
                ];
              }
            }
          },
          { loader: "sass-loader" }
        ]
      }
    ]
  }
}

module.exports = config;
