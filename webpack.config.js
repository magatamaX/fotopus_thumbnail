const path = require('path');

module.exports = {
  mode: 'development',
  // 開発時はdevelopment、リリースもしくはビルド時にはproductionを記入

  entry: {
      'thumbnail': [ 'babel-polyfill', path.resolve(__dirname, 'src/index.js') ],
      'pageScrollAjaxNew': [ 'babel-polyfill', path.resolve(__dirname, 'src/pageScrollAjaxNew.js') ],
      'city/js/phc_result': [ 'babel-polyfill', path.resolve(__dirname, 'src/phc_result.js') ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
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
              presets: ['env', 'react', 'stage-2']
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
