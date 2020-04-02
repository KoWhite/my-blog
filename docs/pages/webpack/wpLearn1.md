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
style-loader 将样式通过<style>标签插入到head中
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

