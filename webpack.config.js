const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'production',
  optimization: { minimize: false },
  node: {
    __dirname: false,
    __filename: false
  },
  entry: {
    graphql: './functions/graphql.js'
  },
  output: {
    path: path.join(__dirname, 'dist/functions'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: '14' } }]
            ]
          }
        }
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^(?:async_hooks|fs|path|url|stream|crypto|http|net|dns|os|tls|https|zlib|events|util|buffer)$/
    })
  ]
};
