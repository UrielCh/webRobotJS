// const path = require('path');

module.exports = {
  mode: "production",
  entry: './zService.js',
  output: {
    filename: 'main.js',
    // path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  target: "node",
};