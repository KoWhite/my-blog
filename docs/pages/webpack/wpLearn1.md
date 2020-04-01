## 1 入门
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

### 例子引入
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

