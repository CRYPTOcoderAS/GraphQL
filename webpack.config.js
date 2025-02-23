const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  mode: 'production',
  optimization: { minimize: false },
  node: {
    __dirname: false,
    __filename: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(mongoose|@apollo)\/)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: { node: '20' },
                modules: 'commonjs'
              }]
            ],
            plugins: [
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining'
            ]
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  externals: ['aws-sdk', 'mongodb-client-encryption'],
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^(?:async_hooks|fs|path|url|stream|crypto|http|net|dns|os|tls|https|zlib|events|util|buffer)$/
    })
  ]
};
