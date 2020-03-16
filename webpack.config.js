const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: 'bundle.js',
    publicPath: '/' //通常是CDN地址
  },
  mode: isDev ? 'development' : 'production',
  devtool: 'cheap-module-eval-source-map', //开发环境下使用
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(le|c)ss$/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [
                require('autoprefixer')({
                  "overrideBrowserslist": [
                    ">0.25%",
                    "not dead"
                  ]
                })
              ]
            }
          }
        }, 'less-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, //10k
              esModule: false,
              name: '[name]_[hash:6].[ext]',
              outputPath: 'assets'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    //数组 放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      config: config.template
    }),
    new CleanWebpackPlugin()
  ],
  devServer: {
    port: '3000', //默认是8000
    quiet: false, //默认不启用
    inline: true, //默认开启inline模式
    stats: "errors-only", //终端仅打印error
    overlay: false, //默认不启用 
    clientLogLevel: "silent", //日志等级
    compress: true //是否启用gzip压缩
  }
}