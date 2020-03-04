# 类
类似大学时候学过的C#或者Java

## 继承

``` typeScript
class Animal {
    move = (distance: number = 0) => {
        console.log(`move ${distance}`)
    }
}

class Dog extends Animal {
    bark () {
        console.log('wolf! wolf!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(20);
dog.bark();
```

这是一个非常简单的继承例子，而在编写H5游戏的时候，我们会建立一个底层舞台，然后让我们的游戏场景继承这个舞台。

## 公共、私有、受保护

学过Java对这个并不陌生，在TS中,成员默认为public。

成员标记为public时，我们可以自由的访问程序里定义的成员。

成员标记为private时，此成员就不能在声明它的类的外部使用，也就是此成员归它的类私有。

成员标记为protected时，此修饰符和private类似，但是protected成员在派生类中依旧可以访问。

## redonly修饰符

可以使用redonly将属性设置成只读的，只读属性必须在声明时或构造函数里被初始化。

``` typeScript
class Octopus {
readonly name: string;
readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
```

## 静态属性

在H5游戏开发的过程中，我时常需要做一些公共的方法以帮助我在项目中使用。而这些公共方法我们一般会设置静态属性，以帮助我访问的便利。

``` typeScript
class Grid {
static origin = {x: 0, y: 0};
calculateDistanceFromOrigin(point: {x: number; y: number;}) {
    let xDist = (point.x - Grid.origin.x);
    let yDist = (point.y - Grid.origin.y);
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
}
constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

当这是了**static**静态属性之后，每次要访问这个属性时，都要在属性前加上类名的形式访问。

## 抽象类

**abstract** 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。抽象方法的语法和接口方法相似。两者都是定义方法签名但不包含方法体。

抽象方法必须包含abstract关键字并且可以包含访问修饰符。

``` typeScript
abstract class Department {

    constructor(public name: string) {

    }

    printName():void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
    constructor () {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting (): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误： 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

## 构造函数

``` typeScript
class Greeter {
greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

## 类也可以当做接口来用

类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。 

``` typeScript
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```