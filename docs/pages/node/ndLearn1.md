# Node.js 入门

<a data-fancybox title="node" href="https://img-blog.csdnimg.cn/20200509094658285.jpg">![node](https://img-blog.csdnimg.cn/20200509094658285.jpg)</a>

[node-demo](https://github.com/KoWhite/node-demo)

## 什么是Node.js

::: tip 官网的话
1、Node.js 是一个基于 Chrome V8 引擎 的 JavaScript 运行环境。

2、Node.js 使用了一个 事件驱动、非阻塞式 I/O 的模型，使其轻量又高效
:::

::: tip  
你在Chrome 里写 JavaScript 控制浏览器

Node.js 让你用类似的方法，控制整个计算机
:::

## Node.js 可以做什么

1. web 服务 - 腾讯视频

搜索引擎优化 + 首屏速度优化 = 服务端渲染

服务端渲染 + 前后端同构 = Node.js

2. 可扩展性 - wayward

Node.js可以利用js的灵活性使玩家可以自定义模块

3. 客户端应用 - twitch.tv

用 Node.js 客户端技术（electron）实现，最大限度服用现有工程。

## BFF 层

1. 对用户侧提供HTTP服务

2. 使用后端PRC服务

## node.js 特有的环境变量

1. __filename 当前运行脚本的位置

2. __dirname 当前运行脚本所在的目录位置

3. process 进程对象

## 什么是npm

1. npm 是什么?
    Node.js 的包管理工具

2. 包是什么?
    别人写的Node.js模块

## Node.js 的非阻塞I/O

1. I/O 即 Input/Output, 一个系统的输入和输出

2. 阻塞 I/O 和非阻塞 I/O 的区别就在于系统接收输入再到输出期间，能不能接收其他输入。

举个例子： 我们去吃饭，在食堂吃 （排队等候打饭吃饭）； 去餐厅吃 （点菜等待吃饭）

对于我们这些点菜人员：排队打饭是阻塞 I/O； 餐厅点菜是非阻塞 I/O;

系统 = 食堂阿姨/服务生，输入=点菜，输出=端菜

饭堂阿姨只能一份一份饭地打 -> 阻塞 I/O（不能接收其他输入）

服务生点完菜之后可以服务其他客人 -> 非阻塞 I/O （可以接收其他输入）

::: tip 非租塞 I/O 的要点在于

1. 确定一个进行 Input/Output 的系统。

2. 思考在I/O过程中，能不能进行其他I/O。

:::

```javaScript
const glob = require('glob');

// 阻塞I/O
var result = null;
console.time('glob')
result = glob.sync(__dirname + '/**/*')
console.timeEnd('glob')
console.log(result);

// 非阻塞I/O
var result = null;
console.time('glob')
glob(__dirname + '/**/*', function (err, res) {
    result = res;
    console.log(result)
})
console.timeEnd('glob')
console.log('1+1=', 1+1)
```

## Node.js异步编程 - callback

回调函数格式规范：
    error-first callback
    Node-style callback

第一个参数是error, 后面的参数才是结果 (node规定，大家遵从的一个规范)

## 事件循环（Event Loop)

``` javaScript

const eventloop = {
    queue: [],

    loop () {
        while (this.queue.length) {
            var callback = this.queue.shift();
            callback();
        }

        setTimeout(this.loop.bind(this), 50);
    },

    add (callback) {
        this.queue.push(callback);
    }
}

eventloop.loop();

setTimeout (() => {
    eventloop.add(function () {
        console.log(1);
    })
}, 500)

setTimeout (() => {
    eventloop.add(function () {
        console.log(2);
    })
}, 800)
```

## Node.js 异步编程 (Promise)

::: tip 概念
当前事件循环得不到的结果，但未来的事件循环会给到你结果

是一个状态机：

1. pending

2. fulfilled/resolved

3. rejected
:::

::: warning 注意
resolve 和 reject状态是不能相互扭转的
:::

::: tip .then 和 .catch 用法

1. resolved 状态的 Promise 会回调后面的第一个.then

2. rejectd 状态的 Promise 会回调后面的第一个 .catch

3. 任何一个 rejected 状态且后面 没有 .catch 的 Promise，都会造成 浏览器/node 环境的全局错误。
:::

执行 then 和 catch 会返回一个新Promise, 该Promise 最终状态根据 then 和 catch 的回调函数的执行结果决定

1. 如果回调函数最终是throw，该 Promise 是 rejected 状态

2. 如果回调函数最终是return，该 Promise 是 resolved 状态

```javaScript
(function () {
    var promise = interview ();
    var promise2 = promise
        .then((res)=> {
            throw new Error('refuse');
        })

    setTimeout(() => {
        console.log(promise);
        console.log(promise2);
    }, 800)

    function interview () {
        return new Promise ((res, rej) => {
            setTimeout (() => {
                if (Math.random () > 0) {
                    res('success');
                } else {
                    rej(new Error('fail'));
                }
            }, 500)
        }) 
    }
})();
```

3. 如果回调函数最终 return 了一个 Promise, 该 Promise 会和回调函数 return 的 Promsie 状态保持一致

```javaScript
(function () {
    var promise = interview ();
    var promise2 = promise
        .then((res)=> {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    res('accept');
                }, 300)
            })
        })

    setTimeout(() => {
        console.log(promise);
        console.log(promise2);
    }, 800)

    setTimeout(() => {
        console.log(promise);
        console.log(promise2);
    }, 1000)
    
    function interview () {
        return new Promise ((res, rej) => {
            setTimeout (() => {
                if (Math.random () > 0) {
                    res('success');
                } else {
                    rej(new Error('fail'));
                }
            }, 500)
        }) 
    }
})();
```

### pormise.all

`Promise.all`获得的成功结果的数组里面的数据顺序和`Promise.all`接收到的数组顺序是一致的。这带来了一个绝大的好处：在前端开发请求数据的过程中，偶尔会遇到发送多个请求并根据请求顺序获取和使用数据的场景，使用`Promise.all`毫无疑问可以解决这个问题。

``` javaScript
(function () {
    Promise
        .all([
            interview('alibaba'),
            interview('tencent')
        ])
        .then(() => {
            console.log('smile')
        })
        // 接收先挂的那一个，假设是alibaba先挂，就先扭转状态到这里
        .catch((err) => {
            console.log('cry for ' + err.name);
        })

    function interview (name) {
        return new Promise ((res, rej) => {
            setTimeout (() => {
                if (Math.random () > .2) {
                    res('success');
                } else {
                    var error = new Error('fail');
                    error.name = name;
                    rej(error);
                }
            }, 500)
        }) 
    }
})();
```

## Node.js 异步编程 (async/await)

1. async function 是 Promise 的语法糖封装

2. 异步编程的终极方案 - 以同步的方式写异步

await 关键字可以 “暂停” async function 的执行

await 关键字可以以同步的写法获取 Promise 的执行结果

try-catch 可以获取 await 所得到的错误

```javaScript
(async function () {
    try {
        await interview (1);
        await interview (2);
        await interview (3);

        //await Promise.all([interview (1), interview (2)]);
    } catch (e) {
        return console.log('cry at ' + e.round)
    }
    console.log('smile')
}())

function interview (round) {
    return new Promise ((res, rej) => {
        setTimeout (() => {
            if (Math.random () < .2) {
                res('success');
            } else {
                var error = new Error('fail');
                error.round = round;
                rej(error);
            }
        }, 500)
    }) 
}
```

## (HTTP) 什么是HTTP服务？

一个网页请求，包含两次HTTP包交换：

1. 浏览器向HTTP服务器发送请求HTTP包

2. HTTP服务器向浏览器返回HTTP包

HTTP服务要做什么事情？

1. 解析进来的HTTP请求报文

2. 返回对应的HTTP返回报文

## (HTTP) 简单实现一个HTTP服务器

```javaScript
const http = require('http');
const fs = require('fs');

http
    .createServer(function(req, res) {
        res.writeHead(200);
        fs.createReadStream(__dirname + '/index.html')
            .pipe(res);
    })
    .listen(3000)
```

在同层文件夹下面创建一个`index.html`文件，然后再执行这个文件就可以启动一个简单的3000端口的本地服务器。

## Express [intro](https://www.npmjs.com/package/express)

::: tip 功能

1. 强壮的路由系统 （服务器分发）
2. 帮助处理HTTP请求的能力
3. 各种模板引擎的支持
4. 提供一系列强大的脚手架
:::

## koa [intro](https://www.npmjs.com/package/koa)

::: tip 功能

1. 中间件（express 在异步的情况下支持较差）
2. context 上面挂着request和response (需要从里面取) 比express 更极致的 request/response 简化
3. 遵循极简思路，没有路由功能（借助中间件koa-mount/koa-router）
:::

### 洋葱模型 [intro](https://juejin.im/post/6844904025767280648)

koa的核心功能：

1. 有比express更极致的 request/response 简化；

    ctx.status = 200
    ctx.body = 'hello world'

2. 使用async function 实现的中间件

    有“暂停执行”的能力
    在异步的情况下也符合洋葱模型

3. 精简内核，所有额外功能都移到中间件里实现

::: warning Express VS Koa

1. express 门槛更低，koa 更强大优雅
2. express 封装很多东西，开发更快速，koa可定制型更高
:::

## RPC 调用 Remote Procedure Call (远程过程调用)

**和 Ajax 有什么相同点？**

1. 都是两个计算机之间的网络通信
2. 需要双方约定一个数据格式

**和 Ajax 有什么不同点？**

1. 不一定使用DNS作为寻址服务
2. 应用层协议一般不使用HTTP （RPC可能使用二进制）
3. 基于TCP或UDP协议

**寻址/负载均衡**

1. AJAX: 使用DNS进行寻址
2. RPC: 使用特有服务进行寻址

**TCP通信方式：**

1. 单工通信 （单向通信）
2. 半双工通信 （同一时间内，不能双向 轮番单工）
3. 全双工通信 （类似双向车道，互不影响）

**二进制协议：**

1. 更小得数据包体积
2. 更快得编解码速率

## Buffer 编解码二进制数据包 [文档](http://nodejs.cn/api/buffer.html)

## Node.js net 模块 [文档](http://nodejs.cn/api/net.html)

::: warning  复盘

1. 单工/半双工的通信通道搭建
2. 全双工的通信通道搭建
    关键在于应用层协议需要有标记包号的字段
    处理一下情况，需要标记包长的字段字段
        1. 粘包
        2. 不完整包
    错误处理
:::
