var path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'libz7js.js',
    library: 'libz7js',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  }
};
