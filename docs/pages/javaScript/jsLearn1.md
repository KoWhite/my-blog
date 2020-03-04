# Array.reduce() 使用学习
本文学习路径来自掘金：<a title="url" href="https://juejin.im/post/5dfd9d27e51d455825129ec3">自从学会了 Array.reduce() ，再也离不开它</a>

`Array.reduce()` 可以返回任意值，它的功能是将一个数组的内容聚合成单个值

返回的值可以使数组、字符串、甚至可以使对象或者新数组。

## 基本使用
`Array.reduce()` 可以接受两个参数: 第一个对数组每个元素执行的回调方法，另一个是初始值。

回调方法接收四个参数，前面两个必需，后两个可选，`total`是当前聚合值，`currentValue`是数组循环时的当前元素, `currentIndex`是数组循环时当前元素的索引，`arr`是当前元素所属的数组对象。

**无论返回什么值，都将作为累加器提供给循环中的下一个元素。初始值将作为第一个循环的累加器。**

``` javascript
let array = [].reduce((total, currentValue) => {
    return total;
}, initialValue)
```

了解到了基本用法，接下来我们看下衍生出来的使用方式：

## 1. 数组求和
假设我们不了解 `Array.reduce()`,可能会使用下面的方法

``` javascript
let sum = 0;
[1, 2, 3].map(item => {
    sum += item
});
```

通过循环遍历的方式获取数组元素然后进行求和，接下来使用`Array.reduce()`方式：

``` javascript
[1, 2, 3].reduce((sum, current) => {
    return sum + current;
} , 0);
```
之前我们知道`reduce`里面有两个参数，而上面的代码表示的是，从`0`开始，并且不断通过回调函数里的方法，将值加到`sum`里面，第一轮循环他的值是初始值`0`，然后变成`1`，再之后变成`3`，然后变成`6`。

## 2. 作为组合多个数组的方法
``` javascript
const greenFood = [
    {
        name: 'apple',
        class: 'fruits'
    },
    {
        name: 'orange',
        class: 'fruits'
    },
    {
        name: 'cabbage',
        class: 'vegetable'
    },
    {
        name: 'banana',
        class: 'fruits'
    }
];
```
假设现在有个需求，需要将所有水果提取出来，将水果名字组成一个新的数组，实现思路之一是通过`filter`过滤出所有`class = fruits`，然后通过`map`方法将名字`push`到一个新的数组中。
``` javascript
let nameArr = [];
let newFruits = greenFood.filter((item) => item.class === 'fruits')
newFruits.map((item) => {
    nameArr.push(item.name)
})
可以看到我们需要通过两步才能做成一个新的数组，性能上面肯定是比较差的
```
那么如果我们使用`Array.reduce()`应该怎么做呢？
``` javascript
greenFood.reduce((newArr, item) => {
    if (item.class === 'vegetable') {
        newArr.push(item.name)
    }
    return newArr;
}, []);
```

## 3. 数组元素分组
``` javascript
let groupBy = (arr, criteria) => {
    return arr.reduce((obj, item) => {
        //  
    }, {})
}
```
在`Array.reduce()`回调函数内部，我们会判断`criteria`是函数还是`item`的属性。然后获取当前`item`的值。

如果`obj`中不存在这个属性，则创建它，并将一个空数组赋值给它。最后，将`item`添加到key的数组中，再返回该对象作为下一次循环的`total`。
``` javascript
var groupBy = function (arr, criteria) {
  return arr.reduce(function (obj, item) {

    // 判断criteria是函数还是属性名
    var key = typeof criteria === 'function' ? criteria(item) : item[criteria];

    // 如果属性不存在，则创建一个
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    // 将元素加入数组
    obj[key].push(item);

    // 返回这个对象
    return obj;

  }, {});
};
```

## 4. 合并数据到单个数组
在上面`greenFood`的基础上，假设现在有这么个需求，
``` javascript
const amount = {
    apple: 200,
    orange: 300,
    cabbage: 200,
    banana: 100
} 
```
现在想要把上面的这份数据加到`greenFood`的元素属性里，那么我们用`Array.reduce()`怎么实现呢？

``` javascript
greenFood.reduce((arr, greenFood) => {
    if (amount[greenFood.name]) {
        greenFood.amount = amount[greenFood.name];
    } else {
        greenFood.amount = 0;
    }

    arr.push(greenFood);

    return arr;
}, [])
```
当然我们也可以灵活运用上面的方法，将数据合并到对象之中。