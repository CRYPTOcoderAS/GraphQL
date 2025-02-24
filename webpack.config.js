const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    graphql: path.join(__dirname, 'functions/graphql.js')
  },
  output: {
    path: path.join(__dirname, 'built-functions'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules\/(?!(@aws-sdk|@smithy)\/)/,
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
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-transform-class-properties'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.mjs']
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^(aws-crt|@aws-sdk\/signature-v4-crt)$/
    })
  ],
  externals: [
    'aws-sdk',
    'mongodb-client-encryption',
    '@aws-sdk/signature-v4-crt',
    'aws-crt'
  ]
};
