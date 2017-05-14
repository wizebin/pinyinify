var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var fs = require('fs');

var includePaths = [
  fs.realpathSync(__dirname + '/src'),
];

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
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        include: includePaths,
        query:
          {
            presets:["es2015", "stage-0", "react"],
          }
      },
      {
        test: /\.svg$/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          },
          {
            loader: 'react-svg-loader?jsx=1',
            query: {
              jsx: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
    ],
  },
}
