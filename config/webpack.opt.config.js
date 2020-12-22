var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          keep_fnames: true,
        },
      })
    ],
  },
  plugins: [
    new OptimizeCssAssetsPlugin(),
  ],
}