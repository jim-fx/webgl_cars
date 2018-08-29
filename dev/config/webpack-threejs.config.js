var path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/js/three-js-small.js',
  output: {
    filename: 'three.min.js',
    path: path.resolve(__dirname, '../src/js')
  },
  plugins: [
    new UglifyJsPlugin()
  ]
};
