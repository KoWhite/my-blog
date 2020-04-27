# 高级用法

## 自动清理构建目录

### 1、通过npm script清理构建目录（不够优雅）

``` javaScript 
rm -rf ./dist && webpack
rimraf ./dist && webpack
```

### 2、借助clean-webpack-plugin （默认会删除output指定的输出目录）

（1）安装

```javaScript
npm i clean-webpack-plugin -D
```

or

```javaScript
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

```javaScript
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
<http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html>
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
<https://segmentfault.com/a/1190000016404266?utm_source=tag-newest>

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

1. 只能作为模块顶层的语句出现
2. import的模块名只能是字符串常量
3. import binding 是immutable的

ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析（不执行代码，从字面量上对代码进行分析，ES6之前的模块化，比如我们可以动态require一个模块，只有执行后才知道引用的什么模块，这就不能通过静态分析去优化）

代码擦除： uglify阶段删除无用代码
:::

## Scope Hoisting使用和原理分析

::: warning 引入
没有开启Scope Hoisting时会出现有大量闭包函数的代码；
大量函数闭包包裹代码，导致体积增大（模块越多越明显）
运行代码时创建的函数作用域变多，内存开销变大

结论： 被webpack转换后的模块会带上一层包裹，import会被转换成_webpack_require
:::

::: tip 原理
将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
:::

::: tip 优势
通过scope hoisting 可以减少函数声明代码和内存开销
:::

::: tip 使用
webpack mode 为 production 默认开启
必须是ES6语法
:::

## 代码分割和动态import

::: tip 懒加载JS方式
CommonJS: require.ensure
ES6: 动态import（目前没有原生支持，需要Babel转换）
:::

### 动态import使用方法

1、安装

```javaScript
npm i @babel/plugin-syntax-dynamic-import --sava-dev
```

or

```javaScript
yarn add @babel/plugin-syntax-dynamic-import --sava-dev
```

2、ES6: 动态import
借助babel，在.babelrc中添加以下插件

```javaScript
"plugin": ["@babel/plugin-syntax-dynamic-import"],
```

## webpack使用ESLint 

::: tip 意义
对代码进行规范检查，避免语法错误
:::

### 方案一：ESLint与CI/CD集成

### 方案二：webpack与ESLint集成(<https://eslint.bootcss.com/>)

<https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb>

## webpack 打包组件或者基础库

webpack除了可以用来打包应用，也可以用来打包js库

## webpack实现SSR打包

::: tip 服务端渲染（SSR）是什么
渲染：HTML+CSS+JS+DATA -> 渲染后的HTML

服务端：
所有模板等资源都存储在服务端
内网机器拉取数据更快
一个HTML返回所有数据
:::

### 客户端渲染（CSR）和服务端渲染（SSR）比对

<a data-fancybox title="CSR\SSR" href="https://img-blog.csdnimg.cn/20200417111127675.png">![CSR\SSR](https://img-blog.csdnimg.cn/20200417111127675.png)</a>

<a data-fancybox title="CSR\SSR" href="https://img-blog.csdnimg.cn/20200417111343821.png">![CSR\SSR](https://img-blog.csdnimg.cn/20200417111343821.png)</a>

### SSR代码实现思路

（1）服务端
使用 react-dom/server 的 renderToString 方法将React组件渲染成字符串

服务端路由返回对应的模板

（2）客户端
打包出针对服务端的组件

### 搭建SSR

1、创建服务端环境
在当前项目中创建server文件夹，接下来将用express帮助搭建服务端环境
安装express

```javaScript
npm i express -D
```

在server中创建index.js入口文件

``` javaScript
if (typeof window === 'undefined') {
    global.window = {};
}

const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');

server (process.env.PORT || 3000);

const server = (port) => {
    const app = express();

    app.use(express.static('dist'));

    app.get('/search', (reg, res) => {
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html);
    });

    // 链接监听
    app.listen(port, () => {
        console.log('Server is running on port:', port)
    })
};

// 创建一个HTML模板
const renderMarkup = (str) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <div className="root">
                ${str}
            </div>
        </body>
        </html>
    `;
}
```

2、创建一个ssr打包
首先创建一个打包文件,注意js的命名不再需要hash，然后在npm Script配置，假设我这里创建名字叫webpack.ssr.js
而后我们在npm Script中配置`"build:ssr": "webpack --config webpack.ssr.js"`以创建一个打包命令

### webpack ssr 打包存在的问题

1. 浏览器的全局变量（Node.js中没有document，window）
    组件适配：将不兼容的组件根据打包环境进行适配
    请求适配：将fetch或者ajax发送请求的写法改成isomorphic-fetch 或者 axios

2. 样式问题（Node.js 无法解析 css)
    方案一：服务端打包通过ignore-loader忽略掉css的解析
    方案二：将 style-loader 替换成 isomorphic-style-loader

### 如何解决样式不显示的问题

使用打包出来的浏览器端html为模板
设置占位符，动态插入组件

针对样式不显示的情况我们接下来修改server下面的index.js

```javaScript
if (typeof window === 'undefined') {
    global.window = {};
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');

const server = (port) => {
    const app = express();

    app.use(express.static('dist'));

    app.get('/search', (reg, res) => {
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html);
    });

    // 链接监听
    app.listen(port, () => {
        console.log('Server is running on port:', port)
    })
};

server (process.env.PORT || 3000);

// 创建一个HTML模板
const renderMarkup = (str) => {
    return template.replace('<!--HTML_PLACEHOLDER-->', str);
}
```

然后修改我们的serch.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"><!--HTML_PLACEHOLDER--></div>
</body>
</html>
```

针对数据的情况，我们同样也可以通过占位符的方式来处理

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"><!--HTML_PLACEHOLDER--></div>
    <!--INITIAL_DATA_PLACEHOLDER-->
</body>
</html>
```

修改server/index.js

```javaScript
if (typeof window === 'undefined') {
    global.window = {};
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');
const data = require('../data.json');

const server = (port) => {
    const app = express();

    app.use(express.static('dist'));

    app.get('/search', (reg, res) => {
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html);
    });

    // 链接监听
    app.listen(port, () => {
        console.log('Server is running on port:', port)
    })
};

server (process.env.PORT || 3000);

// 创建一个HTML模板
const renderMarkup = (str) => {
    const dataStr = JSON.stringify(data);
    return template.replace('<!--HTML_PLACEHOLDER-->', str)
        .replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__initial_data=${dataStr}</script>`)
}
```

## 优化构建时命令行显示日志

::: tip 需求
构建时展示的一大堆日志，很多并不需要开发者关注
:::
通过设置stats来优化，开发阶段放在devServer，生产阶段放在module.exports中。
设置的属性参考<https://www.webpackjs.com/configuration/stats/>

除了设置stats的方式，还可以通过`friendly-errors-webpack-plugin`,并且设置`stats: errors-only`

1、安装

```javaScript
npm i friendly-errors-webpack-plugin -D
```

or

```javaScript
yarn add friendly-errors-webpack-plugin -D
```

2、使用
在生产环境和开发环境中引入对应插件即可：

```javaScript
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

 plugins: [
    ...
    new FriendlyErrorsWebpackPlugin()
 ]
```

## 在webpack中进行错误捕获及异常处理

::: tip 需求
在 CI/CD 的 pipline 或者发布系统需要知道当前构建状态

每次构建完成后输入 echo $? 获取错误码
:::

::: danger 注意
webpack4 之前版本构建失败不会抛出错误码（error code）

Node.js 中的 process.exit 规范
0 表示成功完成，回掉函数中，err为null
非 0 表示执行失败，回掉函数中，err不为null，err.code 就是传给 exit 的数字
:::

::: tip 如何捕获
compiler 在每次构建结束后会触发 done 这个 hook
process.exit 主动处理构建报错
:::

通过在plugins中增加这段

```javaScript
function () {
    this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && process.argv.indexOf('--watch') == -1) {
            console.log('build error');
            process.exit(1);
        }
    })
}
```
