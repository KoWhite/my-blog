# 为何而生

我们知道react的数据传递是通过子父组件的逐层传递，这种方式如果小型项目还好，但是如果是大型项目，跨层取组件内的数据会非常麻烦，代码会变得不可维护，所以我们需要redux，借助redux我们可以将数据放在一个工厂，每个组件都可以取到数据，并且这个数据只要改变，所有组件的数据都会相应改变。

# 三大原则
在真正开始了解redux流程的之前，要牢记redux三大原则：

 **1. 单一数据源**

 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

 **2. State 是只读的**

 唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

 **3. 使用纯函数来执行修改**

 为了描述 action 如何改变 state tree ，你需要编写 reducers。
（纯函数：一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用）

# redux工作流程
<a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20200218111235404.jpg">![avatar](https://img-blog.csdnimg.cn/20200218111235404.jpg)</a>

现在我们假设React Components是一个想借书的人，后面代称为借书者；Action Creators 是想借书说的话；Store是图书馆管理员；Reducers是管理员记录书籍的小本本；
那么我们就能这样理解了，当借书者(React Components)想要借书，会先和管理员说明借什么书(Action Creators)，图书馆管理员(Store)会从他的小本本(Reducers)找是不是有这本书，然后将这本书通过管理员的手给借书者。这样是不是清晰明了~

# 实现步骤
## 1、创建Store
新建文件夹为store，文件夹下新建文件index.js，然后我们在这个文件中创建store：
```javaScript
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer)

export default store;
```
::: warning 注意
reducer就是我们说的管理员的小本本。
:::

## 2、创建Reducers
同样在store目录下新建reducer.js:
```javaScript
const defaultState = {
    // 默认state
    inputValue: '',
    list: []
}

// reduce 可以接收state,但不可以修改state
export default (state = defaultState, action) => {
    return state;
}
```
## 3、组件使用
::: tip 问题 
那我们组件如何使用呢？
:::
```javaScript
import React, { Component } from 'react';
import store from './store/index';
import TodoListUI from './TodoListUI';

export default class TodoList extends Component {
    constructor (props) {
        super(props);
        this.state = store.getState();
    }
 
    render() {
        return <TodoListUI 
            list={this.state.list}
        />
    }
}
```
用getState的方法获取store里面的所有数据，然后在组件中使用；
到这里我们只是完成了一小步
接下来我们创建传话筒，以完成修改数据的功能。
## 4、创建Action Creators 
在store目录下新建actionCreators.js
类似下方代码形式
```javaScript
import { CHANGE_INPUT_VALUE } from './actionTypes';


export const getInputChangeAction = (value) => ({
    type: CHANGE_INPUT_VALUE,
    value
})
```
你可能会好奇引入的常量作用是什么，首先这个常量是如下面的形式：
## 5、创建Action Type *
```javaScript
export const CHANGE_INPUT_VALUE = 'change_input_value';
```
::: warning 注意
最主要的目的是防止当名称写错的时候，会出现报错，更快速的定位到错误信息。
:::
## 6、dispatch(action)
然后在我们组件中调用dispatch方法
```javaScript
import React, { Component } from 'react';
import store from './store/index';
import { getInputChangeAction } from './store/actionCreators';
import TodoListUI from './TodoListUI';

export default class TodoList extends Component {
    constructor (props) {
        super(props);
        this.state = store.getState();
        this.handleInputChange = this.handleInputChange.bind(this);
        store.subscribe(this.handleStoreChange);
    }

    handleInputChange (e) {
        const action = getInputChangeAction(e.target.value);
        store.dispatch(action);
    }

    handleStoreChange () {
        this.setState(store.getState())
    }
 
    render() {
        return <TodoListUI 
            inputValue={this.state.inputValue}
            handleInputChange={this.handleInputChange}
        />
    }
}
```
## 7、改变Store的数据
回到流程图，我们可以知道，当组件内使用dispatch(action)后，store会将一个新的State和action传给Reducers:
```javaScript
import { CHANGE_INPUT_VALUE } from './actionTypes';

const defaultState = {
    inputValue: ''
}

// reduce 可以接收state,但不可以修改state
export default (state = defaultState, action) => {
    if (action.type === CHANGE_INPUT_VALUE) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.inputValue = action.value;
        return newState;
    }
    return state;
}
```
::: warning 注意
在Reducers中，不能直接修改state，所以上面使用了深拷贝的形式去修改state，并且将新的state返回出来。
这样我们就可以实现监听input框里面的内容，并且实现了redux的基础搭建，之后添加在这个基础往上搭即可。
:::
TodoListUI.js
```javaScript
import React from 'react';
import { Input } from 'antd';

const TodoListUI = (props) => {
    return (
        <div>
            <div style={{margin: '20px 0 0 20px'}}>
                <Input 
                    placeholder="Basic usage" 
                    style={{width: '300px', marginRight: '10px' }} 
                    value={props.inputValue}
                    onChange={props.handleInputChange}
                />
            </div>
        </div>
    )
}

export default TodoListUI;
```


