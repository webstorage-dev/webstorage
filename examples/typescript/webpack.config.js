// eslint-disable-next-line
const { resolve } = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  target: "web",
  output: {
    // eslint-disable-next-line no-undef
    path: resolve(__dirname, "public"),
    filename: "index.production.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                module: "ESNext",
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devServer: {
    static: {
      directory: resolve(__dirname, "public"),
    },
    port: 8080,
  },
};
