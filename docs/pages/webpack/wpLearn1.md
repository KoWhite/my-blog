## 1 入门
### 1.1 初始化项目
首先新建一个目录，并且初始化npm

```
npm init
```

webpack运行在node环境中，接下来我们安装两个包

```
npm i -D webpack webpack-cli
```

接下来新建一个文件夹放我们的项目文件，比如新建`src`, 然后在新建一个文件`main.js`,并且可以在此文件中写一些代码测试：

``` 
console.log('hello world!');
```

接下来我们配置package.json命令
``` json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack src/main.js"
},
```

执行

```
npm run build
```

此时如果生成一个dist文件夹，并且内部有main.js文件说明打包成功

### 1.2 自定义设置
现在我们新建一个build文件夹，里面创建一个webpack.config.js

```javaScript
// webpack.config.js

const path = require('path');
module.exports = {
    mode:'development', // 开发模式
    entry: path.resolve(__dirname,'../src/main.js'),    // 入口文件
    output: {
        filename: 'output.js',      // 打包后的文件名称
        path: path.resolve(__dirname,'../dist')  // 打包后的目录
    }
}
```

而后更新package.json

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config build/webpack.config.js"
}
```

执行 npm run build 发现dist文件夹中多了一个output.js文件

### 配置html模板
js文件打包好了，但我们不可能没次在html文件中手动引入打包好的js