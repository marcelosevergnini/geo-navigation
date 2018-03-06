const path = require("path");

const resolvePath = (pathToResolve = "") =>
  path.resolve(__dirname, pathToResolve);

module.exports = {
  entry: resolvePath("src/js/app.js"),
  output: {
    path: resolvePath("dist/bundle"),
    filename: "geonavigation.bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: [resolvePath("src/js")],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: "images/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.obj$/,
        loader: "file-loader",
        include: resolvePath("src/assets/model"),
        options: {
          name: "models/[name].[ext]"
        }
      },
      {
        test: /\.css$/,
        loader: "file-loader",
        include: resolvePath("src/style"),
        options: {
          name: "style/[name].[ext]"
        }
      },
      {
        test: /\.html$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      }
    ]
  }
};
