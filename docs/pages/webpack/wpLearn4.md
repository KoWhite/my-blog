# webpack构建速度及体积优化

## 分析（初级）-使用webpack内置的stats

::: tip 引入

stats: 构建的统计信息

缺点：颗粒度太粗，看不出问题在哪
:::

### stats 使用

`package.json`中使用`stats`

```javaScript
"scripts": {
    "build:stats": "webpack --env production --json > stats.json",
    ...
}
```

## 分析（速度）-使用 speed-measure-webpack-plugin

::: tip 特点

1. 分析整个打包总耗时

2. 每个插件和loader的耗时情况

:::

### 插件使用

1. 安装

    ```javaScript
    npm i --save-dev speed-measure-webpack-plugin
    ```

    or

    ```javaScript
    yarn add speed-measure-webpack-plugin --save-dev
    ```

2. 接入

    在webpack配置文件中引入`speed-measure-webpack-plugin`;

    ```javaScript
    const speedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
    ...
    const smp = new speedMeasureWebpackPlugin();
    ...
    module.exports = smp.wrap({
        ...
    });
    ```

    像上面的例子一样，使用插件中的`wrap`方法将内容包裹起来，在打包完成之后就能看到模块间的时间。

<a data-fancybox title="速度分析" href="https://img-blog.csdnimg.cn/2020042710203448.png">![速度分析](https://img-blog.csdnimg.cn/2020042710203448.png)</a>

## 分析（体积）-使用 webpack-bundle-analyzer

::: tip 作用

1. 依赖的第三方模块文件大小

2. 业务里面的组件代码大小

:::

1. 安装

    ```javaScript
    npm i webpack-bundle-analyzer -D
    ```

    or

    ```javaScript
    yarn add webpack-bundle-analyzer -D
    ```

2. 接入

    在webpack配置文件中引入`webpack-bundle-analyzer`;

    ```javaScript
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    ...
    module.exports = smp.wrap({
        ...
        plugins: [
            ...
            new BundleAnalyzerPlugin ()
        ]
    });
    ```

在构建完成之后可以访问本地8888端口（默认可修改），查看当前项目文件的体积关系

## 优化（速度）-使用 高版本的 webpack 和 Node.js

## 优化（速度）-多进程/多实例构建

::: tip 可选方案

1. thread-loader

2. parallel-webpack

3. HappyPack

:::

### 使用 [HappyPack](https://github.com/amireh/happypack) 解析资源

::: tip 原理
每次 webpack 解析一个模块，HappyPack 会将它及它的依赖分配给 worker 线程中

:::

### 使用 [thread-loader](https://github.com/webpack-contrib/thread-loader) 解析资源

::: tip 原理
每次 webpack 解析一个模块，thread-loader 会将它及它的依赖分配给worker线程中
:::

## 优化（体积）-多进程/多实例：并行压缩

1. 使用 [parallel-uglify-plugin](https://github.com/gdborton/webpack-parallel-uglify-plugin) 插件

2. [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 开启 `parallel` 参数 （webpack 4 版本之前）

3. [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin) 开启 `parallel` 参数 （webpack 4 版本之后）