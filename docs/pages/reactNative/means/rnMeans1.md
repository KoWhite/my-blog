**1、环境搭建**
首先需要下载 node、jdk(需要安装环境变量）这里按照手册里面的流程走
（传送门：[https://reactnative.cn/docs/getting-started/](https://reactnative.cn/docs/getting-started/)）

 安装好之后，需要安装Android studio, 记住这里是jdk已经安装好的情况下，安装根据流程走，其中安装SDK的时候要注意，**安装路径的名称不能是中文并且不能有空格**。如果你没办法改路径名称，你换个路径就可以了

 在安装Virtual Device的过程中出现了**报错Failed to install Intel HAXM**，问题在于没有打开Intel  Virtualization Technology（vt-x）这个选项，可以进入BIOS看看是不是打开，这个问题关乎能不能启动Android studio的模拟机，其实改不改都可以，你可以下载一个外部模拟机或者USB连接实机解决。而后需要安装Android 开发环境，你跟着手册的流程走，能够避开很多的坑

创建好项目之后，react-native run-android ，我链接的真机，在真机上需要开启USB调试模式，而后会让你安装一个安装包，安装好之后会出现一些问题，我这里整理下我出现的问题。
1、手机端出现Could not connect to development server 报错
传送门：[https://blog.csdn.net/qq_25827845/article/details/52974991](https://blog.csdn.net/qq_25827845/article/details/52974991)

2、React Native运行npm start卡住了？（卡Loading dependency graph...阶段）
传送门：[http://www.pianshen.com/article/2067357302/](http://www.pianshen.com/article/2067357302/)

3、出现报错 Execution failed for task ':app:processDebugResources'.
这个时候你删除android\app目录下的build 文件夹然后 命令行执行 react-native run-android 便可以解决。

**2、项目之中遇到的问题**
1、React Native 使用 react-navigation 报错 "Unable to resolve module `react-native-gesture-handler`
**这是因为 react-navigation 依赖
react-native-gesture-handler**

解决方法：

npm install react-native-gesture-handler --save

参考文档：
[https://www.cnblogs.com/wukong1688/p/10818370.html](https://www.cnblogs.com/wukong1688/p/10818370.html)

