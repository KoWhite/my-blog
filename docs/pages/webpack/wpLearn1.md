## 初始化
### 初始化一个简单的package.json
```
npm init
```

### 安装webpack
```
npm i webpack webpack-cli --save-dev
```
or
```
yarn add webpack webpack-cli --save-dev
```

## 例子引入
1、 在上面的环境安装好之后，在当前文件夹下创建`webpack.config.js`，此文件是webpack的配置文件
```javaScript
'use strict';

const path = require('path');

module.export = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: 'production'
}
```

2、从上面代码的字面意思，`entry`是入口文件的路径，output应该是和输出相关。接下来我们在当前文件夹下创建src/index.js文件并且写入以下代码
```javaScript
document.write('hello world');
```
然后在最外层文件夹下创建dist文件夹。

3、我们在package.json文件中scripts添加下面的代码：
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack" // 此为要添加的，原理：模块局部安装在node_modules/.bin目录创建软链接
}
```
4、我们在终端运行指令`npm run webpack`，就可以在dist文件夹下看到我们打包好的文件。

以上是一个简单的webpack打包的例子，接下来我们深入了解

## 核心概念
### 1. entry
::: tip 概念
entry 指定webpack打包入口（源代码）
:::
（1）单入口时是字符串
```javaScript
module.exports = {
    entry: './path/to/my/entry/file.js'
};
```
（2）多入口时是对象
```javaScript
module.exports = {
    entry: {
        app: './src/app.js',
        adminApp: './src/adminApp.js'
    }
};
```
### 2.output
::: tip 概念
Output 用来告诉webpack如何将编译后的文件输出到磁盘（webpack打包结果代码）
:::
（1）单入口配置
```javaScript
module.exports = {
    entry: './path/to/my/entry/file.js',
    output: {
        filename: 'bundle.js'
        path: __dirname + '/dist'
    }
};
```
(2) 多入口配置 （通过占位符确保文件名称唯一）
```javaScript
module.exports = {
    entry: {
        app: './src/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
};
```
### 3. loaders
::: tip 概念
webpack开箱即用只支持js和json两种文件类型，通过Loader可以支持其他文件类型并且把他们转换为有效的模块，添加到依赖图中。
Loader本身是一个函数，接受源文件为参数，返回转换结果。
:::
#### 常用的Loaders
1. babel-loader
转换ES6、ES7等JS新特性的语法

2. css-loader
支持.css文件的加载和解析

3. less-loader
将less文件转换成css

4. ts-loader
将TS转换为JS

5. file-loader
进行图片、文字等的打包

6. raw-loader
将文件以字符串的形式导入

7. thread-loader
多进程打包JS和CSS (提高打包速度)

#### 用法
```javaScript
const path = require('path');

module.exports = {
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.txt$/,  // 指定匹配规则
                use: 'raw-loader' // 指定使用loader名称
            }
        ]
    }
}
```

### 4. plugins
::: tip 概念
插件用于bundle文件的优化，资源管理和环境变量注入
作用于整个构建过程
:::
#### 常用plugins
1. CommonsChunkPlugin 将chunks相同的模块代码提取成公共的js

2. CleanWebpackPlugin 清理构建目录

3. ExtractTextWebpackPlugin 将CSS从bundle文件里提取成一个独立的css文件

4. CopyWebpackPlugin 将文件或者文件夹拷贝到构建的输出目录

5. HtmlWebpackPlugin 创建html文件去承载输出的bundle

6. UglifyjsWebpackPlugin 压缩js

7. ZipWebpackPlugin 将打包出的资源生成一个zip包

#### 用法 (放plugins数组里)
```javaScript
const path = require('path');

module.exports = {
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
```
### 5.mode
::: tip 概念
Mode 指定当前构建环境是: production（生产环境）、development（开发阶段）还是none
设置 mode 可以使用wenpack内置函数，默认为priduction (wp4新概念)
:::
#### 功能介绍
1. development
设置`process.env.NODE_ENV`的值为`development`，开启`NamedChunksPlugin`和`NamedModulesPlugin`。

2. production
设置`process.env.NODE_ENV`的值为`production`，开启`FlagDependencyUsagePlugin`,`FlagIncludedChunksPlugin`,`ModuleConcatenationPlugin`,`NoEmitOnErrorsPlugin`,`OccurrenceOrderPlugin`,`SideEffectsFlagPlugin`,`TerserPlugin`。

3. none
不开启任何优化选项

## 使用
### 1. 解析ES6（使用babel）
安装babel
```
npm i @babel/core @babel/preset-env babel-loader -D
```
or
```
yarn add @babel/core @babel/preset-env babel-loader -D
```
首先使用`babel-loader`,在webpack配置文件中添加此loader
```javaScript
const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    }
}
```
使用babel配置文件，创建`.babelrc`，添加babel preset配置
```json
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

### 2.解析React JSX
安装
```
npm i react react-dom @babel/preset-react -D
```
or
```
yarn add react react-dom @babel/preset-react -D
```
在上面的基础上，在.babelrc增加：
```json
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react" // 新增React 的 babel preset配置
    ]
}
```
之后我们修改我们的src/search.js文件
```javaScript
import React from 'react';
import ReactDom from 'react-dom';

export default class Search extends React.Component {

    render () {
        return (
            <div>Search Text</div>
        )
    }
}

ReactDom.render(
    <Search />,
    document.getElementById('root')
)
```

### 3.解析css
css-loader用于加载.css文件，并且转换成commonjs对象

style-loader 将样式通过style标签插入到head中
安装
```
npm i style-loader css-loader -D
```
or 
```
yarn add style-loader css-loader -D
```
添加Loader:
```javaScript
module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            // 以下为添加内容
            {
                test: /\.css$/,
                use: [
                    'style-loader',// 链式调用，顺序从右到左
                    'css-loader'
                ]
            }
        ]
    }
}
```
在代码中使用import引入css文件，我们构建之后可以发现样式是生效的。

### 4. 解析Less和SaSS
less-loader用于将less转换为css.

首先我们安装Less和less-loader
```
npm i less less-loader -D
```
or
```
yarn add less less-loader -D
```
`webpack.config.js`添加`less-loader`:
```javaScript
module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',// 链式调用，顺序从右到左
                    'css-loader'
                ]
            },
            //以下为添加内容
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    }
}
```

### 5、解析图片或字体
解析图片需要用到`file-loader`用于处理文件

首先我们需要在项目中安装`file-loader`:
```
npm i file-loader -D
```
or
```
yarn add file-loader -D
```

在`webpack.config.js`中引入`file-loader`
```javaScript
{
    test:/\.(png|jpg|gif|jpeg)$/,
    use: 'file-loader'
}
```

而后我们就可以在项目中引用图片文件在最后构建的时候也能够成功

解析字体也可以用`file-loader`处理

```javaScript
{
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: 'file-loader'
}
```

除了使用`file-loader`解析之外，我们还可以使用`url-loader`，可以设置较小资源自动base64

使用前先安装
```
npm i url-loader -D
```
or
```
yarn add url-loader -D
```

```javaScript
{
    test:/\.(png|jpg|gif|jpeg)$/,
    use: {
        loader: 'url-loader',
        options: {
            limit: 10240
        }
    }
}
```

以上是几个常用的loader的用法

## webpack文件监听
::: tip 概念
文件监听是发现源码发生变化时，自动重新构建出新的输出文件。
:::
webpack开启监听模式，有两种方式：

1. 启动webpack命令时，带上--watch参数；(唯一缺陷：每次需手动刷新浏览器)
修改package.json文件
```javaScript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "watch": "webpack --watch"
}
```
2. 在配置`webpack.config.js`中设置`watch:true`；

### 原理分析
轮询判断文件的最后编辑时间是否变化

某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等aggregateTimeout
```javaScript
module.export = {
    // 默认false，也就是不开启
    watch: true,
    // 只有当watch:true时，watchOptions才有意义
    watchOptions: {
        // 默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored: /node_modules/,
        // 监听到变化发生后会等300ms再执行，默认为300ms
        aggregateTimeout: 300,
        // 判断文件是否发生变化时通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
        poll: 1000
    }
}
```

## 热更新
### 1. webpack-dev-server
:::tip 特点
WDS不刷新浏览器；不输出文件，而是放在内存中；使用HotModuleReplacementPlugin插件
:::
首先需要安装`webpack-dev-server`
```
npm i webpack-dev-server -D
```
or
```
yarn add webpack-dev-server -D
```
然后修改`package.json`:
```javaScript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "watch": "webpack --watch",
    "dev": "webpack-dev-server --open"
}
```
配置好之后，我们修改`webpack.config.js`配置文件
```javaScript
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'development', // 修改环境
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',// 链式调用，顺序从右到左
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/\.(png|jpg|gif|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    //以下为添加内容
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true  // webpack文档表明配置了此会自动引入这个插件
    }
}
```
我们执行`npm run dev`命令，就可以实现代码热更新

### 2. webpack-dev-middleware
:::tip 特点
WDM 将webpack输出的文件传输给服务器，适用于灵活的定制场景
:::
```javaScript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

app.listen(3000, function () {
    console.log('Example app listening on port 3000!\n')
})
```

### 热更新的原理
1、Webpack Compile: 将JS编译成Bundle;

2、HMR Server: 将热更新的文件输出给HMR Runtime;

3、Bundle Server: 提供文件在浏览器访问;

4、HMR Runtime: 会被注入到浏览器，更新文件变化;（桥）

5、bundle.js: 构建输出文件

## 文件指纹
:::tip 概念
打包后输出的文件名的后缀，好处：版本管理
:::
### 种类
1. Hash: 和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值就会改变；

2. Chunkhash: 和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值；

3. Contenthash: 根据文件内容来定义hash, 文件内容不变，则contenthash不变（css文件）

### 使用
1、chunkhash: 设置output的filename
```javaScript
entry: {
    index: './src/index.js',
    search: './src/search.js'
},
output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name][chunkhash:8].js'
}
```
2、contenthash
```javaScript
plugins: [
    new MiniCssExtractPlugin({
        filename: '[name][contenthash:8].css'
    })
]
```
3、hash，设置file-loader的name
```javaScript
{
    test:/\.(png|jpg|gif|jpeg)$/,
    use: {
        loader: 'file-loader',
        options: {
            name: 'img/[name][hash:8].[ext]'
        }
    }
}
```

## 代码压缩
### 1. JS文件压缩
内置`uglifyjs-webpack-plugin`(默认打包出来是已压缩)

### 2. CSS文件压缩
使用`optimize-css-assets-webpack-plugin`，同时使用`cssnano`

首先安装`optimize-css-assets-webpack-plugin`
```
npm i optimize-css-assets-webpack-plugin -D
```
or
```
yarn add optimize-css-assets-webpack-plugin -D
```
其次安装`cssnano`
```
npm i cssnano -D
```
or
```
yarn add cssnano -D
```
修改`webpack.config.js`
```javaScript
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 先引入插件

plugins: [
    new MiniCssExtractPlugin({
        filename: '[name]_[contenthash:8].css'
    }),
    // 设置插件内容
    new OptimizeCSSAssetsPlugin ({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')
    })
]
```

### 3. HTML文件压缩
`html-webpack-plugin`，设置压缩参数
首先安装`html-webpack-plugin`
```
npm i html-webpack-plugin -D
```
or
```
yarn add html-webpack-plugin -D
```
修改`webpack.config.js`
```javaScript
plugins: [
    new MiniCssExtractPlugin({
        filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin ({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')
    }),
    // 以下为新增内容，现在src下创建两个html文件
    new HtmlWebpackPlugin ({
        template: path.join(__dirname, 'src/search.html'),
        filename: 'search.html',
        chunks: ['search'],
        inject: true,
        minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
        }
    }),
    new HtmlWebpackPlugin ({
        template: path.join(__dirname, 'src/index.html'),
        filename: 'index.html',
        chunks: ['index'],
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
]
```
