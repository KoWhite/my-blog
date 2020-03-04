# 接口
## 初探
首先我们先看一段代码：
``` typeScript
function printLabel(labelledObj: { label: string }) {
console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```
上面代码表示我们会传一个对象给函数，但是在函数的参数中有lable: string，他表示所传的参数中必须有label,并且label的值必须是string类型。
现在我们使用ts接口的方式重写上面的代码：
``` typeScript
interface LabelledValue {
label: string;
}

function printLabel(labelledObj: LabelledValue) {
console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj); 
```
interface 是ts定义接口的语法，只要传入的对象满足上面定义的必要条件，编译器就会认为他是允许的。还有一点需要注意的是，编译器不会检查属性的顺序，所以定义的接口里面的属性先后，和传参先后没有关系。

## 可选属性
这个方法在编程的过程中经常用到，可选即表示可传可不传，不想上面那么强硬，定义了的可选属性即使没有传也不会报错
举文档上面的例子：
``` typeScript
interface SquareConfig {
color?: string;
width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
let newSquare = {color: "white", area: 100};
if (config.color) {
    newSquare.color = config.color;
}
if (config.width) {
    newSquare.area = config.width * config.width;
}
return newSquare;
}

let mySquare = createSquare({color: "black"});
```
可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误

## 只读属性
语法如下
``` typeScript
interface example {
    readonly x: number,
    readonly y: string
}

let p1: example = { x: 10, y: 'hello world' };
p1.x = 5; // error
```
在属性前面添加readonly就能达到定义只读属性的目的。

只读属性即表示通过赋值之后，只读属性就不能再改变值，只能被读取，不能被改变。

TS还有一个ReadonlyArray<...>,和Array<...>类似，但是在数组创建后不能被修改。

## 类接口
``` typeScript
interface ClockInterFace {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor (h: number, m: number){}
}
```
还可以在接口描述一个方法，在类里使用他

## 继承接口

``` typeScript
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let suqre = <Square>{};
square.color = "blue";
square.sideLength = 10;
```
一个接口还可以继承多个接口，创建出多个接口的合成接口
``` typeScript
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let suqre = <Square>{};
square.color = "blue";
square.penWidth = 100;
square.sideLength = 10;
```

## 混合类型
一个对象可以同时作为函数和对象使用，并且带有额外的属性
``` typeScript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```