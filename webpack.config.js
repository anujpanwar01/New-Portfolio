const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WorkboxPlugin = require("workbox-webpack-plugin");
const port = process.env.PORT || 3000;

module.exports = () => {
  console.log(process.env.NODE_ENV);

  const plugins = [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: path.resolve(__dirname, "dist/*"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ];

  if (process.env.NODE_ENV === "test") {
    plugins.push(new BundleAnalyzerPlugin());
  }

  if (process.env.NODE_ENV !== "development") {
    plugins.push(
      new WorkboxPlugin.GenerateSW({
        exclude: [/\.html$/],
        clientsClaim: true,
        skipWaiting: true,
      })
    );
  }
  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[fullhash].js",
      // publicPath: "dist",
      clean: true,
    },
    resolve: {
      extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    plugins,
    optimization: {
      splitChunks: {
        chunks: "all",
        hidePathInfo: true,
        minSize: 20000,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            reuseExistingChunk: true,
          },
        },
      },
    },
    devtool: process.env.NODE_ENV === "production" ? false : "source-map",
    mode: process.env.NODE_ENV,
    devServer: {
      port: port,
      historyApiFallback: true,
      open: true,
    },
  };
};
