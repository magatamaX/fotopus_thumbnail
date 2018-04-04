const path = require('path');

module.exports = {
  mode: 'development',
  // 開発時はdevelopment、リリースもしくはビルド時にはproductionを記入

  entry: {
      'index': [ 'babel-polyfill', path.resolve(__dirname, 'src/index.js') ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'thumbnail.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react']
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devServer: {
    contentBase: 'dist'
  },

  plugins: []
}
