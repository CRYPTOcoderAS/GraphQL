const path = require('path');

module.exports = {
  optimization: { minimize: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { node: '18' } }]],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
};
