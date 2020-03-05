# 引入
redux自身只支持同步的数据处理，一个action从被dispatch处理，一路同步引发reducer被调用，然后同步更新store上的state,再同步引发视图的更新。

当我们想使用redux来管理异步方法的时候，中间件是一种方式，利用Store Enhancer是更高阶的方式。

但是其实action的目的是用来描述修改数据的行为，如果将异步方法也添加至action总感觉怪怪的，但是我主要是想学习redux的中间件，假如后面会用到呢~

# 目的
假设我在项目中需要封装一些异步的方法来请求后端数据，我们除了可以把请求放在组件当中，也可以使用redux的中间件，将异步方法放在action中，action返回一个方法，dispatch处理action时调用这个方法，从而获取相关数据。

## redux-thunk
使用之前必须引入包：
```
npm install --save redux-thunk
```

然后在创建store的地方，引入redux-thunk:
```javaScript
import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk';

const store = createStore(reducer,applyMiddleware(thunk))

export default store;
```

使用redux中间件需要使用redux的applyMiddleware方法，而后像上面代码一样将thunk引入。

然后在actionCreators中，以函数方式返回，如下：
```javaScript
const changeHomeData = (result) => ({
    type: actionTypes.CHANGE_HOME_DATA,
    topicList: result.topicList,
    articleList: result.articleList,
    recommendList: result.recommendList
})

export const getHomeInfo = () => {
    return (dispatch) => {
        axios.get('/api/home.json').then((res) => {
            const result = res.data.data;
            const action = changeHomeData(result);
            dispatch(action);
        })
    }
}
```
在dipatch时候调用这个action,在执行的时候，上面的一部请求会一起被执行，获取相关的后端数据，并且传递给reducer处理相关操作。

如果应用需要与服务器交互，则应用 thunk 等中间件可以解决异步数据流问题。Thunk 使我们能够编写返回函数（而不是对象）的 action creator。然后 thunk 可以用来延迟 action 派遣，或仅在满足特定条件（例如请求被解决）后再派遣。

## redux-saga
相较redux-thunk，这个中间件会比较复杂一些，并且使用了ES6的Generator的功能，但是redux-thunk把异步进程放在action中，这个中间件会使action更干净，并且避免回调地狱。
首先是安装：
```javaScript
npm install --save redux-saga
```
然后在创建store的地方调用saga的对应方法，这里使用官方文档的示例：
```javaScript
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers'
import mySaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// then run the saga
sagaMiddleware.run(mySaga)

// render the application
```
然后我们要在创建一个saga用于请求后端数据
```javaScript
import { takeEvery, put } from 'redux-saga/effects';
import { GET_INIT_LIST } from './actionTypes';
import { initListAction } from './actionCreators';
import axios from 'axios'

function* getInitList() {
    try {
        const res = yield axios.get('/list.json')
        const action = yield initListAction(res.data);
        yield put(action);
    } catch(e) {

    }
}

function* TodoSagas() {
    yield takeEvery(GET_INIT_LIST, getInitList);
}
  
export default TodoSagas;
```

saga有很多方法可供使用，文档跳转<a title="url" href="https://redux-saga-in-chinese.js.org/">redux-saga官方文档</a>

在学习的过程中，我觉得redux-saga的学习成本会比较高一点，所以小型项目会比较喜欢用redux-thunk，但是从整体代码而言，我觉得把异步逻辑放在action里面就像是大杂烩，而且维护起来也不咋地，不复杂的业务用async、await足够了，复杂点的项目使用rxjs。

