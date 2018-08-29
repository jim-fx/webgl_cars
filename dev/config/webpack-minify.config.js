var path = require('path');

const ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = {
  entry: './dev/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new ClosureCompilerPlugin({
      concurrency: 3
    })
  ]
};
