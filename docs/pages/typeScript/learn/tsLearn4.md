# 函数
## 函数类型
``` typeScript
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function (x: number, y: number): number { return x + y; };
```
函数类型包括两个部分：参数类型和返回值类型，当写出完整函数类型的时候，这两个部分都是需要的

``` typeScript
let add: (x: number, y: number) => number =
function (x: number, y: number): number { return x + y };
```
说实话我看了文档才知道还有这样的写法。。。。。。
或者还可以这么写
``` typeScript
let add: (baseValue: number, increment: number) => number =
function (x: number, y: number): number { return x + y };
```
只要参数类型匹配，不在乎参数名是否一致

## 推断类型
如果你在赋值语句一边指定了类型但在另一边没有指定类型，TS会自动识别出类型：
``` typeScript
let add = function (x: number, y: number): number {return x + y };

let add: (baseValue: number, increment: number) => number =
function (x: number, y: number) { return x + y };
```

## 可选参数和默认参数
TS每个函数参数都是必须的（这样可以有效杜绝许多BUG），指的是每个参数是必须要传的，而JS中每个参数是可选的，也就是可传可不传，没传参这个参数即是Undefined。而在TS中这个功能的使用如下：
``` typeScript
function result(data: string, type?: string) {
    if (type)
        // A结果
    else
        // B结果
}
```
这是我在项目中经常会使用的场景

## 剩余参数
必要参数，默认参数和可选参数有两个共同点：它们表示某一个参数。你想同时操作多个参数，或者你并不知道会有多少参数传递出来。
剩余参数会被当做个数不限的可选参数。可以一个没有，同样也可以有任意个。编译器创建参数数组，名字是你再省略号( ... ) 后面给定的名字，你可以在函数体内使用这个数组。
``` typeScript
function build(firstName: string, ...resetOfName: string()) {
    return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string []) => string = buildName;
```