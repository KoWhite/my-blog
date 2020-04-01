## 因何而生
::: tip 用途
vuex是适用于vue项目开发时使用的状态管理工具。假设项目中频繁使用组件创参的方式同步data的值，一旦项目变庞大，维护起来会非常麻烦。所以vue提供vuex，我们只需要把值定义在vuex中，即可在整个vue项目中使用。
:::

## 安装
在vue项目中引入
```
npm i vuex -s
```
or
```
yarn add vuex
```

## vuex工作流程
<a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20200401135535109.png">![vuex](https://img-blog.csdnimg.cn/20200401135535109.png)</a>


## 用法
### 1、创建store
类似redux，在src文件夹下创建store并且创建index.js文件，然后我们创建state:
```javascript
import Vue from 'vue'
import Vuex from 'vuex'

// 挂载vuex
Vue.use(Vuex)

// 创建Vuex对象
const store = new Vuex.Store({
    state: {
        // 存放的键值对就是管理的状态
        name: 'helloVuex'
    }
})

export default store;
```

### 2、使用state
首先在整个项目入口文件main.js中引入store, 类似下方操作
``` javascript
import Vue from 'vue'
import App from './App.vue'
import store from './store' // 引入文件

Vue.config.productionTip = false

new Vue({
  store, // 使用
  render: h => h(App),
}).$mount('#app')

```
我们可以使用语法`$store.state.name`获取我们在state中的数据name
::: tip 举例
在App.vue中获取state中的name内容
:::
```html
<template>
  <div id="app">
    {{ $store.state.name }}
  </div>
</template>
```

## 核心内容
### 1、getters
::: tip 概念
相当于vue中的computed计算属性，getter的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生变化才会被重新计算。每次调用均相当于执行一次函数，所以不适合大量计算。
:::
1、利用getter访问属性
```javaScript
store.getters.doneList();
store.getters.getById(1);
```

2、利用mapGetters辅助函数访问属性
```javaScript
import {mapGetters} from 'vuex'
export default {
    // ...
    computed:{
        // 直接返回列表
        ...mapGetters:([
            getById,
            doneList
        ]),
        // 指定返回的键
        mapGetters:({
            byId:'getById',
            done:'doneList'
        })
    }
}
```

### 2、mutation
::: tip 概念
我们获取到了name，但是如果我们需要修改name的值，vuex提供了mutation给我修改state的值
:::
接下来假设我需要通过点击按钮来改变state中的name
1、定义mutation
```javascript
import Vue from 'vue'
import Vuex from 'vuex'

// 挂载vuex
Vue.use(Vuex)

// 创建Vuex对象
const store = new Vuex.Store({
    state: {
        // 存放的键值对就是管理的状态
        name: 'helloVuex'
    },
    mutations: {
        CHANGE_NAME: (state, name) => {
            state.name = name;
        }
    }
})

export default store;
```
2、调用mutation
```javascript
<template>
  <div id="app">
    {{ $store.state.name }}
    <button @click="handleChangeName">changeName</button>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    handleChangeName () {
      this.$store.commit(
        'CHANGE_NAME', 
        'MichLiu'
      )
    }
  },
}
</script>
```
看到这里你可能会觉得和redux挺像的。
### 3、Actions
::: tip 概念
action 提供了异步修改state的接口，这点和mutation不同，可以在action中异步请求接口
:::
1、action的定义
```javaScript
const store = new Vuex.Store({
    state: {
        // 存放的键值对就是管理的状态
        name: 'helloVuex'
    },
    mutations: {
        CHANGE_NAME: (state, name) => {
            state.name = name;
        }
    },
    actions: {
        changeName (store, name) {
            store.commit("CHANGE_NAME", name)
        }
    }
})
```
2、action的使用
```javaScript
<template>
  <div id="app">
    {{ $store.state.name }}
    <button @click="handleChangeName">changeName</button>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    handleChangeName () {
      this.$store.dispatch("changeName", 'MichLiu')
    }
  },
}
</script>
```