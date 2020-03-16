# webpack核心概念
- entry: 入口
- output: 输出
- loader: 模块转换器，用于把模块原内容按照需求转换成新内容
- 插件(plugins): 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情

### 如何处理样式文件
- 安装依赖
```
npm install style-loader less-loader css-loader postcss-loader autoprefixer less -D
```
```javascript
//webpack.config.js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
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
            }
        ]
    }
}
```
  - style-loader 动态创建 style 标签，将 css 插入到 head 中.
  - css-loader 负责处理 @import 等语句。
  - postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀 —— 2020了，应该没人去自己徒手去写浏览器前缀了吧
  - less-loader 负责处理编译 .less 文件,将其转为 css
  ##### 注意
  - loader 的执行顺序是从右向左执行的，也就是后面的 loader 先执行，上面 loader 的执行顺序为: less-loader ---> postcss-loader ---> css-loader ---> style-loader

  - 当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。

  - 现在，我们已经可以处理 .less 文件啦，.css 文件只需要修改匹配规则，删除 less-loader 即可。

### 图片/字体文件处理
- 我们可以使用 url-loader 或者 file-loader 来处理本地的资源文件。url-loader 和 file-loader 的功能类似，但是 url-loader 可以指定在文件大小小于指定的限制时，返回 DataURL，因此，个人会优先选择使用 url-loader。
```javascript
//webpack.config.js
module.exports = {
    //...
    modules: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false 
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    }
}
```
- 此处设置 limit 的值大小为 10240，即资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录。esModule 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
- 将资源转换为 base64 可以减少网络请求次数，但是 base64 数据较大，如果太多的资源是 base64，会导致加载变慢，因此设置 limit 值时，需要二者兼顾。
- 默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名，例如我上面的图片(thor.jpeg)对应的文件名如下：
```css
body {
  background: url(f80950c….jpg);
}
```
- 你也可以通过 options 参数进行修改。
```javascript
use: [
    {
        loader: 'url-loader',
        options: {
            limit: 10240, //10K
            esModule: false,
            name: '[name]_[hash:6].[ext]'
        }
    }
]
```# webpack-first
