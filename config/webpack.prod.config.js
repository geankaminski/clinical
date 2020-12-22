var webpack = require('webpack');
var merge = require('webpack-merge');
var dotenv = require('dotenv').config();
var baseConfig = require('./webpack.base.config');
var optimizationConfig = require('./webpack.opt.config');

const productionConfiguration = function (env) {
  return {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL),
        'process.env.NODE_ENV': '"production"',
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]
  };
}

module.exports = merge.smart(baseConfig, optimizationConfig, productionConfiguration(process.env));
