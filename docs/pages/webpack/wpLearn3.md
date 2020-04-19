
## 构建配置管理
### 构建配置抽离成 npm 包的意义
::: tip 通用性
1. 业务开发者无需关注构建配置
2. 统一团队构建脚本 
:::

::: tip 可维护性
1. 构建配置合理的拆分
2. README 文档、ChangeLog 文档等
:::

::: tip 质量
1. 冒烟测试、单元测试、测试覆盖等
2. 持续集成
:::

### 可选方案
1、通过多个配置文件管理不同环境的构建， webpack --config 参数进行控制；

2、将构建配置设计成一个库，比如：hjs-webpack、Neutrino、webpack-blocks；

3、抽成一个工具进行管理，比如：create-react-app、kyt、nwb；（人数规模较大）

4、将所有的配置放在一个文件，通过--env 参数控制分支选择；

### 构建配置包设计
(1)、通过多个配置文件管理不同环境的 webpack 配置
1. 基础配置：webpack.base.js
2. 开发环境：webpack.dev.js
3. 生产环境：webpack.prod.js
4. SSR环境：webpack.ssr.js

(2)、抽离成一个 npm 包统一管理
规范：Git commit 日志、README、ESLint 规范、Semver 规范
质量：冒烟测试、单元测试、测试覆盖率和CI

### 配置组合
通过 `webpack-merge` 组合配置

合并配置: module.exports = merge(baseConfig, devConfig);

### 结构设计
<a data-fancybox title="目录结构" href="https://img-blog.csdnimg.cn/20200419112012211.png">![目录结构](https://img-blog.csdnimg.cn/20200419112012211.png)</a>
::: tip 引入
如上图创建我们的目录结构，然后针对对应的功能需求添加到相应模块，base.js用于作为我们的基础模块，之后针对每个打包情况的特殊性再对相应模块进行特殊化；
最后使用merge的方法串联起来。
:::
比如，我创建了之前学习文章中的功能集合，添加再base.js中

```javaScript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const setMPA = () => {
    const entry = {};
    const HtmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

    entryFiles.map((item, index) => {
        const entryFile = item;
        const match = entryFile.match(/src\/(.*)\/index\.js/)
        const pageName = match && match[1];

        entry[pageName] = entryFile;
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
        );
    })

    return {
        entry,
        HtmlWebpackPlugins
    }
}

const { entry, HtmlWebpackPlugins } = setMPA();

module.exports = {
    entry,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [  
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    }
                ]
            },
            //以下为添加内容
            {
                test:/\.(png|jpg|gif|jpeg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        function () {
            this.hooks.done.tap('done', (stats) => {
                if (stats.compilation.errors && process.argv.indexOf('--watch') == -1) {
                    console.log('build error');
                    process.exit(1);
                }
            })
        }
    ].concat(HtmlWebpackPlugins),
    stats: 'errors-only'
}
```
然后在`webpack.dev.js`中对开发环境进行特殊化
```javaScript
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base');

const devConfig = {
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true  // webpack文档表明配置了此会自动引入这个插件
    }
};

module.exports = merge(baseConfig, devConfig);
```
上面代码中针对开发环境添加了热更新功能，其它环境的文件也是类似上面代码，进行特殊化添加，最后使用merge串联起来。

其余代码：[github](https://github.com/KoWhite/webpack-demo/tree/1787f9a4f8414dc6c73ec2711cc30bfafc16b4df/builder-webpack)

## 使用ESLint 规范构建脚本
使用`eslint-config-airbnb-base`, `eslint --fix` 可以自动处理空格


