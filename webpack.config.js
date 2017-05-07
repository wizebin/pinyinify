var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: __dirname + '/src/index.jsx',

  output: {
    filename: "app.js",
    path: __dirname + "/build",
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      "React": "react",
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.(svg|jsx?)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query:
          {
            presets:["es2015", "stage-0", "react"],
          }
      },

      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ],
  },
}