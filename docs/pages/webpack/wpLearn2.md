# 高级用法

## 自动清理构建目录
### 1、通过npm script清理构建目录（不够优雅）
``` javaScript 
rm -rf ./dist && webpack
rimraf ./dist && webpack
```

### 2、借助clean-webpack-plugin （默认会删除output指定的输出目录）
（1）安装
```
npm i clean-webpack-plugin -D
```
or
```
yarn add clean-webpack-plugin -D
```
（2）使用这个插件
首先在webpack配置文件引入这个插件：
```javaScript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
```
然后在plugins中：
```javaScript
+ new CleanWebpackPlugin()
```

## 使用PostCSS插件autoprefixer自动补齐CSS3前缀（后置处理）
根据 can i use (https://caniuse.com/)规则
（1）安装
```javaScript
npm i postcss-loader autoprefixer -D
```
or
```javaScript
yarn add postcss-loader autoprefixer -D
```

## 通过webpack进行px转化为rem
（1）安装
```javaScript
npm i px2rem-loader -D
npm i lib-flexible -S
```
or
```javaScript
yarn add px2rem-loader -D
yarn add lib-flexible -S
```

## 静态资源内联

## 多页面打包方案
::: tip 思路
每个页面对应一个entry，一个html-webpack-plugin
手动添加灵活性差，可以利用glob.sync
entry: glob.sync(path.join(__dirname, './src/*/index.js'))
:::
（1）安装Glob
```javaScript
npm i glob -D
```
or
```
yarn add glob -D
```

（2）使用
首先需要明白，glob.sync可以帮助我们获取到所有src文件夹下面的index.js入口，我们根据这个功能来展开

引入glob
```javaScript
const glob = require('glob');
```
然后我们可以写一个函数以动态的创建入口和出口
```javaScript
const setMPA = () => {
    const entry = {}; // 存储输入
    const HtmlWebpackPlugins = [];// 存储对应插件配置

    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js')) // 获取所有文件夹下的index.js路径

    entryFiles.map((item, index) => {
        const entryFile = item;
        const match = entryFile.match(/src\/(.*)\/index\.js/); // 通过正则表达式
        const pageName = match && match[1]; // 获取index.js父文件夹的名称

        entry[pageName] = entryFile; // 创建输入
        HtmlWebpackPlugins.push(
            new HtmlWebpackPlugin ({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        ); // 以数组的形式存储输出口
    })

    return {
        entry,
        HtmlWebpackPlugins
    }
}
```
定义好函数之后，我们将对应数据配置
```javaScript
const { entry, HtmlWebpackPlugins } = setMPA();

module.exports = {
    entry, // 入口数据
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    ...
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin ({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin()
    ].concat(HtmlWebpackPlugins) // 连接两个数组
```
以上便是当多页面情况的处理方式，灵活性高，后期可以根据项目任意修改

## 使用sourcemap
::: tip 功能
http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
开发环境开启，线上环境关闭（容易暴露业务逻辑）
线上排查问题的时候可将sourcemap上传到错误监控系统
:::
（1）关键字
eval: 使用eval包裹模块代码

source map: 产生.map文件

cheap: 不包含列信息

inline: 将.map作为DataURI嵌入，不单独生成.map文件

module: 包含loader的sourcemap

（2）具体功能细化
https://segmentfault.com/a/1190000016404266?utm_source=tag-newest

## 提取页面公共资源
### 基础库分离（以react为例）
（1）通过html-webpack-externals-plugin
::: tip
思路：将react、react-dom 基础包通过cdn引入，不打入bundle中
方法：使用html-webpack-externals-plugin
:::

```javaScript
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

plugin: [
    new HtmlWebpackExternalsPlugin({
        externals: [
            {
                module: 'react',
                entry: 'https://unpkg.com/react@16/umd/react.development.js',
                global: 'React'
            },{
                module: 'react-dom',
                entry: 'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
                global: 'ReactDOM'
            }
            
        ]
    })
]
```

（1）利用SplitChunksPlugin 进行公共脚本分离
webpack4内置的，替代CommonsChunkPlugin插件

chunks 参数说明：
1. async异步引入的库进行分离
2. inital 同步引入的库进行分离
3. all 所有引入的库进行分离

```javaScript
optimization: {
    splitChunks: {
        minSize: 0, // 分离的包体积大小
        cacheGroups: {
            commons: {
                test: /(react|react-dom)/, // 匹配出需要分离的包
                name: 'vendonrs', 
                chunks: 'all',
                minChunls: 2 // 设置最小的引用次数为2次
            }
        }
    }
}
```

## tree shaking (摇树优化)
::: tip 概念
一模块可能有多个方法，只要其中的某个方法使用到，则整个文件都会被打到bundle里，tree shaking就是只把用到的方法打到bundle，没用到的方法会在uglify阶段被擦除掉
:::

::: tip 使用
webpack 默认支持，在.babelrc里设置 modules: false 即可
:::

:::tip 要求
必须是ES6的语法，CJS的方式不支持
:::

:::tip 原理
利用ES6模块的特点：
    只能作为模块顶层的语句出现
    import的模块名只能是字符串常量
    import binding 是immutable的

代码擦除： uglify阶段删除无用代码
:::