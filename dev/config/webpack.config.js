var path = require('path');

module.exports = {
  entry: './dev/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('./dist')
  }
};
