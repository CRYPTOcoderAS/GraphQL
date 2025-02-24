const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
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
        test: /\.m?js$/,
        exclude: /node_modules\/(?!(mongodb|mongoose|@aws-sdk|@mongodb-js)\/)/,
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
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules']
  },
  externals: ['aws-sdk', 'mongodb-client-encryption']
};
