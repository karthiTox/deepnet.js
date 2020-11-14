const path = require('path');

module.exports = {
    entry: './test/index.ts',
    module: {
      rules: [
        {
          test: /\.(ts)$/,
          exclude: /node_modules/,
          use: ['ts-loader']
        }
      ]
    },
    resolve: {
      extensions: ['*', '.ts']
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist'
    }
  };