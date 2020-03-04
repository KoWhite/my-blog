首先我使用的react-navigation是4.x版本，然后我的代码是这样的：

<a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191023141919638.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3NjYwMzg3,size_16,color_FFFFFF,t_70">![avatar](https://img-blog.csdnimg.cn/20191023141919638.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3NjYwMzg3,size_16,color_FFFFFF,t_70)</a>

经过查询因为react-navigation 3.x版本以上的createBottomTabNavigator是不能直接像上面代码暴露出来，所以出现此报错，需要使用createAppContainer包裹起来：


<a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191023142133381.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3NjYwMzg3,size_16,color_FFFFFF,t_70">![avatar](https://img-blog.csdnimg.cn/20191023142133381.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3NjYwMzg3,size_16,color_FFFFFF,t_70)</a>