# 泛型
## 何为泛型
为了满足可重用性，组件不仅能够支持当前的数据类型，同时也可以支持未来的数据类型，这在创建大型系统时危机你提供非常便利的功能

```typeScript
function identity<T> (arg: T): T {
    return arg;
}
```

我们给identity添加了类型变量T。T帮助我们捕获用户传入的类型（比如：number），之后我们可以使用这个类型。之后我们再次使用了 T当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。 

我们定义了泛型函数后，可以用两种方法使用。 第一种是，传入所有的参数，包含类型参数： 

```typeScript
let output = identity<string>("myString");  // type of output will be 'string'
```

这里我们明确的指定了T是string类型，并做为一个参数传给函数，使用了<>括起来而不是()。

第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：

```typeScript
let output = identity("myString");  // type of output will be 'string'
```

## 使用泛型变量
编辑器要求你在函数体必须正确的使用这个通用的类型。你必须把这些参数当做是任意或所有类型。

```typeScript
function identity<T>(arg: T): T {
    return arg;
}
```

这个时候如果我们想同时打印出arg的长度，可以这样做：

```typeScript
function loggingIdentity<T> (arg: T): T {
    console.log(arg.length); // Error: T doesn`t have .length
    return arg;
}
```

这个时候编辑器会告诉我们使用了arg的length属性，但是没有指明arg具有这个属性。这些类型变量代表的是任意类型，所以传入的可能是个数字，但是数字是没有.length属性的。

我们可以像创建其它数组一样创建这个数组：

```typeScript
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
} 
```

你可以这样理解loggingIdentity的类型：泛型函数loggingIdentity，接收类型参数T和参数arg，它是个元素类型是T的数组，并返回元素类型是T的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 T的的类型为number。 这可以让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性。 

```typeScript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

使用过其它语言的话，你可能对这种语法已经很熟悉了。自定义泛型像Array<T>一样。

## 泛型类型
我们创建了identity通用函数，可以适用于不同的类型。

泛型函数的类型与非泛型函数的类型没什么不同，只有一个类型参数在最前面，像函数声明一样：

```typeScript
function identity<T>(arg: T): T {
    return arg;
}

let mtIdentity: <T>(arg: T) => T = identity;
```

我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。

```typeScript
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: <U>(arg: U) => U = identity;
```

我们还可以使用带有调用签名的对象字面量来定义泛型函数：

```typeScript
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: {<T>(arg: T): T} = identity;
```

这样引导我们写一个泛型接口：

```typeScript
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity； GenericIdentityFn =  identity;
```

接下来我们可以把泛型参数当作整个接口的一个参数。这样我们可以清楚的知道使用的具体是哪个泛型类型。这样接口里的其它成员也能知道这个参数的类型。

```typeScript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn<number> = identity;
```
注意，我们的实例做了少许改动，不再描述泛型函数，而是把非泛型函数签名作为泛型类型的一部分。当我们使用GenericIdentityFn时，还要传一个类型参数来制定泛型类型，锁定之后代码里使用的类型。

我们可以创建泛型类型，也可以创建泛型类。注意，无法创建泛型枚举和泛型命名空间。

## 泛型类
泛型类和泛型接口差不多。泛型类使用（<>）括起泛型类型，跟在类名后面:

```typeScript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) { return x + y; };
```

GenericNumber类的使用时十分直观的

```typeScript
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

与接口一样，直接把泛型类型放在类后面，可以帮助我们确认类的所有属性都在使用相同的类型。

## 泛型约束

```typeScript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

相比于操作any所有类型，我们想要限制函数去处理任意带有.length属性的所有类型。 只要传入的类型有这个属性，我们就允许，就是说至少包含这一属性。 为此，我们需要列出对于T的约束要求。

为此，我们定义一个接口来描述约束条件。 创建一个包含 .length属性的接口，使用这个接口和extends关键字来实现约束：

```typeScript
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再适用于任何类型

```typeScript
loggingIdentity(3);  // Error, number doesn't have a .length property
```

我们需要传入符合约束类型的值，必须包含必须的属性：

```typeScript
loggingIdentity({length: 10, value: 3});
```

### 在泛型约束中使用类型参数
你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 obj上，因此我们需要在这两个类型之间使用约束。

```typeScript
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

### 在泛型里使用类类型
在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如:

```typeScript
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。

```typeScript
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```