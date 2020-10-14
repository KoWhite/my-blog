# 了解vite

## 什么是vite

::: tip 作者原话
vite，一个基于浏览器原生ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有vue文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境可以把同一份代码用rollup打包。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。
:::

## 优势

从作者原话很明显可以知道，vite的最大优势是解决传统打包工具在开发环境热更新速度变慢的问题，其原理是拦截浏览器发出的ES imports请求并做响应处理，在开发模式中不需要打包，只需要编译浏览器发出的HTTP请求对应的文件，所以热更新速度很快。

## [上手vite](https://github.com/vitejs/vite)

::: warning 注意
Vite当前仅适用于Vue3.x。意味着您不能使用尚未与Vue 3兼容的库。
:::

```
npm init vite-app <project-name>
cd <project-name>
npm install
npm run dev
```

`npm init vite-app` 命令会执行 `npx create-vite-app`，从npm上拉取[create-vite-app](https://www.npmjs.com/package/create-vite-app)模块，然后通过对应的模块生成模板文件到指定的文件夹

在上面的命令之后我们可以查看生成的文件目录：

<a data-fancybox title="catalogue" href="https://img-blog.csdnimg.cn/20201013143843191.png">![目录](https://img-blog.csdnimg.cn/20201013143843191.png)</a>


我们看看入口文件`index.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

发现入口文件`index.html`多了一段代码：

```html
<script type="module" src="/src/main.js"></script>
```

这里直接使用了浏览器原生的`ES Module`功能

### [ESM](https://blog.shenfq.com/2019/%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96%E7%9A%84%E4%BB%8A%E7%94%9F/)

`script module` 是ES模块在浏览器端的实现，目前主流的浏览器都已经支持

<a data-fancybox title="compatibility" href="https://img-blog.csdnimg.cn/20201013145832763.png">![兼容性](https://img-blog.csdnimg.cn/20201013145832763.png)</a>

当声明一个`script`标签类型为module时，浏览器将对其内部的`import`引用发起`HTTP`请求获取模块内容。比如上述，浏览器将发起一个对`HOST/src/main.js`的HTTP请求，获取内容之后再执行。

vite劫持这些请求，在后端进行相对应的处理，然后再返回给浏览器。

由于浏览器只会对用到的模块发起HTTP请求，所以Vite没必要对项目里所有的文件先打包后返回，而是只编译浏览器发起HTTP请求的模块即可。

回到我们的程序，通过运行指令可以看到我们的页面：

<a data-fancybox title="index" href="https://img-blog.csdnimg.cn/20201013163632629.png">![首页](https://img-blog.csdnimg.cn/20201013163632629.png)</a>

所有的js文件经过vite处理之后，其import的模块路径将会被修改，在前面加上`/@modules/`。当浏览器请求import模块的时候，vite会在`node_modules`中找到对应的文件进行返回。

`main.js`内容

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')
```

<a data-fancybox title="index" href="https://img-blog.csdnimg.cn/20201013163632622.png">![首页](https://img-blog.csdnimg.cn/20201013163632622.png)</a>

为了解决 `import xxx from xxx` 报错的问题，vite对这种资源路径做了一个统一的处理，加一个`/@module/`前缀。在`src/node/server/serverPluginModuleRewrite.ts`源码这个koa中间件里可以看到vite对import都做了一层处理，其过程如下：

+ 在 koa 中间件里获取请求 body
+ 通过 [es-module-lexer](https://github.com/guybedford/es-module-lexer) 解析资源 ast 拿到 import 的内容
+ 判断 import 的资源是否是绝对路径，绝对视为 npm 模块
+ 返回处理后的资源路径："vue" => "/@modules/vue"

#### 支持/@module/

在 `src/node/server/serverPluginModuleRewrite.ts`源码中可以看到大致的逻辑是：

+ 在 koa 中间件里获取请求 body
+ 判断路径是否以 /@module/ 开头，如果是取出包名
+ 去node_module里找到这个库，基于 package.json 返回对应的内容

#### 文件编译

之前提过了普通js module的处理，但是对于其他文件比如`vue`、`css`是怎么处理的呢？

我们对比下App.vue

```vue
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-size: 50px;
}
</style>
```

而我们开发环境实际加载的文件内容变成了这样：

```javascript
import HelloWorld from '/src/components/HelloWorld.vue'

const __script = {
    name: 'App',
    components: {
        HelloWorld
    }
}

import "/src/App.vue?type=style&index=0"
import {render as __render} from "/src/App.vue?type=template"
__script.render = __render
__script.__hmrId = "/src/App.vue"
__script.__file = "D:\\Users\\xxx\\Desktop\\vite\\src\\App.vue"
export default __script
```

经过两个文件的对比我们可以看到，这里把vue文件拆成了两个请求，（分别对应 script、style 和template），浏览器会先收到包含script逻辑的App.vue的响应，然后解析到template和style的路径后，会再次发起HTTP请求来请求对应的资源，此时vite对其拦截并再次处理后返回内容：

```javascript
// /src/App.vue?type=style&index=0
import { updateStyle } from "/vite/client"
const css = "\n#app {\n  font-size: 50px;\n}\n"
updateStyle("7ac74a55-0", css)
export default css
```

```javascript
// /src/App.vue?type=template
import {createVNode as _createVNode, resolveComponent as _resolveComponent, Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock} from "/@modules/vue.js"

const _hoisted_1 = /*#__PURE__*/
_createVNode("img", {
    alt: "Vue logo",
    src: "/src/assets/logo.png"
}, null, -1 /* HOISTED */
)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_HelloWorld = _resolveComponent("HelloWorld")

    return (_openBlock(),
    _createBlock(_Fragment, null, [_hoisted_1, _createVNode(_component_HelloWorld, {
        msg: "Hello Vue 3.0 + Vite"
    })], 64 /* STABLE_FRAGMENT */
    ))
}
```

**vite是在按需加载的基础上拦截请求实现实时按需编译** 