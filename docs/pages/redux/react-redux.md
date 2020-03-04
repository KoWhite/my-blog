# 有何作用
React-Redux是一个帮助React和Redux有机关联起来的组件。

Redux不能非常方便的用在React当中，不是不能用，只是用起来很蹩脚！我们需要一个组件帮我们把这件事情干的漂亮一些，这个组件就是React-Redux。

# 如何使用
## 安装
```javaScript
npm install --save react-redux
```
或者
```javaScript
yarn add react-redux
```

##  Provider和connect 
react-redux提供<Provider />的组件，他的作用是使你的项目可以访问到store中的数据:
```javaScript
import React, { Component } from 'react';
import Header from './common/header/index.js';
import store from './store/index';
import { Provider } from 'react-redux';

class App extends Component {
    render () {
        return (
            <Provider store={store}>
                <Header />
            </Provider>
        )
    }
}

export default App;
```
以上是你项目入口的位置使用Provider的方法。

接下来使用connect的方式
```javaScript
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

class Header extends PureComponent {
    render () {
        return (
            <HeaderWrapper />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
}

const mapDispathToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispathToProps)(Header);
```
首先先**import**引入**connect**方法，然后再如上方代码使用**connect**方法

**connect**接受两个参数，都为可选参数，不需要可以使用**null**代替

第一个参数也就是**mapStateToProps**: 每当**store state**发生变化时，会被调用，接受整个**store state**,并且返回一个该组件所需要的数据对象；

第二个参数也就是**mapDispatchToProps**: 这个参数可以是一个函数或者是对象:
1. 如果是一个函数，一旦该组件被创建，就会被调用。接收**dispatch**作为一个参数，并且返回一个能够使用的**dispatch**来分发**actions**的若干函数组成的对象；

2. 如果是一个**action creators**构成的对象，每一个**action creator**将会转化为一个**prop function**并会在调用是自动分发**actions**。