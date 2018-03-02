var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/Consolet/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: 'consolet.min.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.json', '.less'],
    alias: {
    }
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      { 
        test: /\.ts$/, 
        loader: 'ts-loader' 
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  // devtool: '#eval-source-map',
  plugins: [
    new CleanWebpackPlugin([ __dirname + '/dist/*']),
    new HtmlWebpackPlugin({
      filename: './example.html',
      template: './src/example.html',
      inject: true
    })
  ]
}


if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
    //   new webpack.DefinePlugin({
    //     'process.env': {
    //       NODE_ENV: '"production"'
    //     }
    //   }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ])
  }