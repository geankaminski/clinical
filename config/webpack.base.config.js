var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var Dotenv = require('dotenv-webpack');
var path = require('path');
console.log(path.resolve(__dirname))

module.exports = {
  devServer: {
    historyApiFallback: false,
  },
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true,
                publicPath: (resourcePath, context) => {
                  // publicPath is the relative path of the resource to the context
                  // e.g. for ./css/admin/main.css the publicPath will be ../../
                  // while for ./css/main.css the publicPath will be ../
                  return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2|ttf|eot|ico)$/,
        exclude: '/node_modules/',
        use: {
          loader: 'file-loader',
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      favicon: './public/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './public/404.html',
      filename: './404.html',
      favicon: './public/favicon.ico'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      allChunks: true,
      disable: process.env.NODE_ENV !== 'production'
    }),
    new Dotenv({
      silent: process.env.NODE_ENV === 'production',
      path: path.resolve(__dirname, '../.env')
    }),
  ],
}
