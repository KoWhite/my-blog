
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

## 冒烟测试

::: tip 概念
冒烟测试是指对提交测试的软件在进行详细深入的测试之前进行的预测试

目的是暴露导致软件重新发布的基本功能失效等严重问题
:::

::: tip 步骤

1. 构建是否成功

2. 每次构建完成build目录是否有内容输出

是否有JS、CSS等静态资源文件

是否有HTML文件
:::

### 判断构建是否成功

（1）可以通过`npm script` 中配置构建命令，通过命令行开始构建判断构建是否成功

（2）首先我们创建一个测试的路口文件，在`test`文件夹下创建`smoke`文件夹，在此文件夹下创建`index.js`文件

然后在`smoke`下创建`template`文件夹放置我们文章之前的代码，删除多余的webpack配置文件

```javaScript
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf'); // 需要先安装rimraf

process.chdir(path.join(__dirname, 'template'));

// 作用是先将./dist移除。第二个参数是移除完成之后的回调
rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod.js');

    // 执行配置文件，第二个参数是执行完成之后的回调，一个是错误参数，一个是状态码
    webpack(prodConfig, (err, stats) => {
        if (err) {
            console.error(err);
            process.exit(2);
        }

        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false
        }));

        console.log('Webpack build success, begin run test')
    })
});
```

### 判断基本功能是否正常

以mocha为例，编写mocha测试用例，判断构建是否有内容输出

安装mocha：

```javaScript
npm i mocha -D
```

or

```javaScript
yarn add mocha -D
```

首先我们在`index.js`同层级下创建`html-test.js`，此文件用于检测是否有html文件输出

```javaScript
// 首先需要npm安装glob-all
const glob = require('glob-all');

describe('Checking generated html files', () => {
    it ('should generated html false', (done) => {
        const files = glob.sync([
            './dist/index.html',
            './dist/search.html'
        ]);

        if (files.length > 0) {
            done();
        } else {
            throw new Error('no html files generated')
        }
    })
});
```

然后我们再同层级下创建`css-js-test.js`，此文件用于检测是否有css/js文件输出

```javaScript
const glob = require('glob-all');

describe('Checking generated css js files', () => {
    it ('should generated css js false', (done) => {
        const files = glob.sync([
            './dist/index_*.js',
            './dist/index_*.css',
            './dist/search_*.js',
            './dist/search_*.css'
        ]);

        if (files.length > 0) {
            done();
        } else {
            throw new Error('no css js files generated')
        }
    })
});
```

最后我们在命令行中执行`node test/smoke/index.js`

[mocha教程]('https://www.liaoxuefeng.com/wiki/1022910821149312/1101741181366880')

## 单元测试和测试覆盖率

接下来以mocha为例

1. 技术选型：Mocha + Chai

2. 测试代码：describe, it, except

3. 测试命令：mocha add.test.js

### 单元测试接入

1. 安装 mocha + chai

```javaScript
npm i mocha chai -D
```

or

```javaScript
yarn add mocha chai -D
```

2. 新建`test`目录，并增加`xxx.test.js`测试文件

创建测试文件`index.js`

```javaScript
const path = require('path');

process.chdir(path.join(__dirname, 'smoke/template/'));

describe('builder-webpack test code', () => {
    require('./unit/webpack-base-test')
})
```

创建单元测试文件`webpack-base-test.js`

```javaScript
const assert = require('assert');

describe('webpack.base.js test  case', () => {
    const baseConfig = require('../../lib/webpack.base.js');

    it('entry', () => {
        assert.equal(baseConfig.entry.index, 'D:/demo/wp-demo/builder-webpack/test/smoke/template/src/index/index.js');
        assert.equal(baseConfig.entry.search, 'D:/demo/wp-demo/builder-webpack/test/smoke/template/src/search/index.js');
    })
});
```

3. 在`package.json`中的`scripts`字段增加`test`命令

```javaScript
"scripts": {
    "test": "node_modules/mocha/bin/_mocha"
},
```

4. 执行测试命令

```javaScript
npm run test
```

### 覆盖测试

这里推荐使用[instanful]('https://istanbul.js.org/')

npm 或者yarn 安装好之后，在`package.json`中的`scripts`字段修改`test`命令

```javaScript
"scripts": {
    "test": "istanbul cover ./node_modules/mocha/bin/_mocha"
},
```

## 持续集成

::: tip 作用

1. 快速发现错误；

2. 防止分支大幅偏离主干；

核心措施是，代码集成到主干之前，必须通过自动化测试。只要一个测试用例失败，就不能集成。
:::

### 接入Travis CI

1. <https://travis-ci.org/> 使用 Github 账号登录；

2. 在<http://travis-ci.org/account/repositories>为项目开启

3. 项目根目录下新增 .travis.yml

### 接入实操

首先在github上面创建一个repository，然后将我们之前写的`builder-webpack`放在文件夹中，之后我们可以访问上面的travis CI网站看到我们的项目。

我们在项目根目录中新增`.travis.yml`：

```javaScript
language: node_js

sudo: false

cache: 
    apt: true
    directories: 
        - node_modules

node_js: stable

install: 
    - npm install -D
    - cd ./test/smoke/template
    - npm install -D
    - cd ../../../

scripts:
    - npm test
```

将代码push到github，之后便可以在travis CI 看到我们项目的构建

<a data-fancybox title="travis CI" href="https://img-blog.csdnimg.cn/20200426163643379.png">![travis CI](https://img-blog.csdnimg.cn/20200426163643379.png)</a>

## 发布构建包到npm

首先在npm官网查看下需要发布的包名有没有重复

然后命令行运行`npm login`登录你的npm账号

执行`npm publish`发布版本

升级版本

1. 升级补丁版本号：npm version patch

2. 升级小版本号：npm version minor

3. 升级大版本号：npm version major
