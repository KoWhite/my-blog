# 前言

   在过去的egret游戏开发中，使用的是TypeScript语言，整个开发过程中给我的感觉TS的接口，函数定义类型等等功能使我在开发过程躲避了非常多BUG，成功验证了真香定律！在未来的开发过程中，为了防止我忘记，我决定记录下来所学。

# 基础类型
   微软号称TS是JS的超集，那么意义上TS支持与JS几乎相同的数据类型：

   ## 布尔值
   ``` typeScript
   let isDone: boolean = false;
   ```
   我们可以看到和js有些不同的是，在声明类型跟着: boolean,这代表者这个变量的值必须是boolean值，否则不能赋值并且会报错，类似这样的声明方式我们往下看：

   ## 数字
   ``` typeScript
   let decLiteral: number = 6;
   let hexLiteral: number = 0xf00d;
   let binaryLiteral: number = 0b1010;
   let octalLiteral: number = 0o744;
   ```
   TS所有数字都是浮点数，除了支持十进制和十六进制，TS还支持二进制和八进制面量（来自ES2015），而声明语法上和上面的方式类似

   ## 字符串
   ``` typeScript
   let name: string = "bob";
   name = "smith";
   ```
   字符串同样支持ES6语法，可以使用模板字符串定义多行文本和内嵌表达式
   ``` typeScript
   let num: number = 666;
   let str_1 = `age is ${num}`;
   let str_2 = 'age is ' + num; 
   ```
   str_1 和 str_2 效果相同

   ## 数组
   TS有两种方式可以定义数组：
   第一种可以通过在元素类型后接上[],表由此类型元素组成一个数组：
   ``` typeScript
   let list: number[] = [1, 2, 3];
   ```
   第二种使用数组泛型，Array<元素类型>：
   ``` typeScript
   let list: Array<number> = [1, 2, 3];
   ```

   ## 元组Tuple
   此类型允许表示一个已知元素数量和类型的数组，各个元素的类型可以不必相同
   ``` typeScript
   let arr: [string, number];
   arr = ['hello', 100]; // 这样不会报错
   arr = [100, 'hello']; // 这样会报错
   ```
   在后面我们要访问元组中已知索引的元素，可以得到正确的类型，而超出了数组元素，则会使用联合类型替代；

   ## 枚举
   enum（枚举）是对JS标志数据类型的一个补充，使用枚举类型可以为一组数值赋予名字
   ``` typeScript
   enum Color {Red, Green, Blue}
   let c: Color = Color.Green
   ```

   ## Any
   any就如同他的字面意思一样，当你不知道将会赋给变量什么类型时，或者你不希望类型检查器对这些值进行检查，即可以使用any代替
   ``` typeScript
   let num: any = 4; // true
   let str: any = 'hello world'; // true
   let bool: any = true; // true
   ```
   同样它可以使用在数组上
   ``` typeScript
   let list: any[] = [1, true, 'hello world'];
   list[1] = 1;
   ```
   到这里你可能会觉得any和Object作用类似，但是Object类型的变量只是允许你给他赋任意值，但是不能调用任意的方法

   ## Void
   Void 表示没有任何类型，一般是用于函数没有返回值时：
   ``` typeScript
   function warnUser(): void {
    console.log("This is my warning message");
   }
   ```
   当然也可以声明void类型的变量，但是你只能赋予undefined或者null;
   ``` typeScript
   let unusable: void = undefined;
   ```

   ## Null 和 Undefined
   在TS中，undefined 和 null 两者各自有自己的类型分别叫 undefined 和 null, 和void相似，但是他们的作用不大。
   默认情况下，null 和 undefined 是所有类型的子类型，你可以将这两个值赋给number

   ## Never
   never 表示永不存在的值的类型。never类型也是任何类型的子类型，可以赋给任意类型；但是没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。
   ``` typeScript
   // 返回never的函数必须存在无法达到的终点
   function error(message: string): never {
      throw new Error(message);
   }

   // 推断的返回值类型为never
   function fail() {
      return error("Something failed");
   }

   // 返回never的函数必须存在无法达到的终点
   function infiniteLoop(): never {
      while (true) {
      }
   }
   ```

   ## Object
   Object 表示非原始类型，除了number, string,boolean,symbol,null或undefined之外的类型
   ``` typeScript
   declare function create(o: object | null): void;

   create({ prop: 0 }); // OK
   create(null); // OK

   create(42); // Error
   create("string"); // Error
   create(false); // Error
   create(undefined); // Error
   ```

   ## 类型断言
   类型断言是告诉编译器，你知道一个实体有比他现有类型更精准的类型
   类型断言有两种语法：
   ``` typeScript
   let str: any = "hello world";
   let strLength: number = (<string>str).length;
   ```
   在上面的代码中，我设置了str是any类型，而后，使用类型断言语法告诉编辑器是string类型
   第二种语法是：
   ``` typeScript
   let str: any = "hello world";
   let strLength: number = (str as string).length;
   ```
   我在平时的开发过程中比较喜欢第一种语法。


   