程序报错：

null is not an object (evaluating 'rngesturehandlermodule.default.direction') 

解决：

```
react-native run-android
```

尝试各种方式无解，受此文章启发，重新生成下好了

分析：

可能是因为生成后，安装的 react-native-gesture-handler ，虽然link后，start成功运行，但还需要重新生成下debug-apk才行

转自：[https://www.cnblogs.com/fanlu/p/11098253.html](https://www.cnblogs.com/fanlu/p/11098253.html)