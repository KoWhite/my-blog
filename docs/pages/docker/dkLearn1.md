::: tip    
本文学习路线来自：[方糖完免课](https://mian.ftqq.com/course/detail/23)
:::

## 为什么要用Docker

<a data-fancybox title="虚拟机和docker对比" href="https://img-blog.csdnimg.cn/20210322173703905.png">![虚拟机和docker对比](https://img-blog.csdnimg.cn/20210322173703905.png)</a>

1. 虚拟机方案会为每一台虚拟机创建独立的操作系统。

2. docker应用只有一个操作系统，操作系统之后是跑的引擎，每个引擎都有一个独立的容器（公用操作系统内核），避免了资源浪费。

## Docker是什么，有哪些功能

### Docker的原理

**1. Namespaces 进程树、网络接口、挂载点进行隔离实现进程间通信**

::: tip 宿主机
此概念相对于子机而言，比如你安装有虚拟机的话，那么相对于虚拟机而言，你正在使用的计算机就是宿主机，虚拟机是安装在主机上的，必须在主机上才能运行，主机就是一个“宿主”。
:::

<a data-fancybox title="宿主机" href="https://img-blog.csdnimg.cn/20210322173858454.png">![宿主机](https://img-blog.csdnimg.cn/20210322173858454.png)</a>

docker是使用`Namespaces`来对每个沙箱的进程进行隔离的

<a data-fancybox title="网络接口" href="https://img-blog.csdnimg.cn/2021032217400346.png">![网络接口](https://img-blog.csdnimg.cn/2021032217400346.png)</a>

对于网络接口，docker是对每个沙箱制作一个`虚拟网卡`，把虚拟网卡链接到`docker云`上，然后docker云通过`iptables`和`宿主机`相连

**2. CGroups 隔离CPU、内存、磁盘I/O、网络带宽**

<a data-fancybox title="CGroups" href="https://img-blog.csdnimg.cn/2021032217410563.png">![CGroups](https://img-blog.csdnimg.cn/2021032217410563.png)</a>

此工具可以创建多个groups，每个groups有相应的配额

**3. Unionfs 文件系统、镜像**

<a data-fancybox title="Unionfs" href="https://img-blog.csdnimg.cn/20210322174200490.png">![Unionfs](https://img-blog.csdnimg.cn/20210322174200490.png)</a>


操作系统会以相同层和不同层进行划分，相同层作为只读层，不同层作为可写层。

<a data-fancybox title="操作系统划分" href="https://img-blog.csdnimg.cn/20210322174306217.png">![操作系统划分](https://img-blog.csdnimg.cn/20210322174306217.png)</a>

<a data-fancybox title="联合文件系统" href="https://img-blog.csdnimg.cn/20210322175053353.png">![联合文件系统](https://img-blog.csdnimg.cn/20210322175053353.png)</a>

联合文件系统，可以把不同的文件系统一层层叠加起来，让程序使用的时候看起来只是一个文件系统

如图，第一层放一个a文件夹（只读），第二层在a文件夹里放一个b文件夹（只读），第三层在b文件夹中放一个（可写的）c文件。联合文件系统访问时是没有目录结构的。

<a data-fancybox title="联合文件系统划分" href="https://img-blog.csdnimg.cn/20210322174306225.png">![联合文件系统划分](https://img-blog.csdnimg.cn/20210322174306225.png)</a>

如图，每个系统都会使用只读的文件系统层，然后会给每个系统挂载可写的文件系统层。

<a data-fancybox title="联合文件系统划分" href="https://img-blog.csdnimg.cn/20210322174306269.png">![联合文件系统划分](https://img-blog.csdnimg.cn/20210322174306269.png)</a>

只读层被叫做`镜像`

可写层被叫做`容器`

<a data-fancybox title="联合文件系统划分" href="https://img-blog.csdnimg.cn/20210322174306501.png">![联合文件系统划分](https://img-blog.csdnimg.cn/20210322174306501.png)</a>

最底层是`系统内核`，容器都会共享一个系统内核

<a data-fancybox title="联合文件系统划分" href="https://img-blog.csdnimg.cn/20210322174306552.png">![联合文件系统划分](https://img-blog.csdnimg.cn/20210322174306552.png)</a>

在这之上回挂载联合文件系统，蓝色和橙色是不同的部分，橙色部分的BusyBox是一个`只读镜像`，蓝色部分是有三个层次叠加的镜像，Debian、add emacs、add Apache，三层都是`只读`，

<a data-fancybox title="联合文件系统划分" href="https://img-blog.csdnimg.cn/20210322174306515.png">![联合文件系统划分](https://img-blog.csdnimg.cn/20210322174306515.png)</a>

在两个镜像上边都有一个可写层

所以我们使用docker，**最核心的方式，就是先拉取一个镜像，然后创建一个容器，然后在容器中运行命令。**

docker运行命令的程序和虚拟机完全不同，虚拟机在设计上来讲就是一个操作系统，所以在启动之后就会一直在执行。而docker更像是被设计用来执行命令，因为一旦命令执行完，程序就退出了。每次命令来了就会先运行，运行完了就退出。

docker就是把上面的功能整合起来变成了一个完整的容器方案。

**docker架构**

<a data-fancybox title="docker架构" href="https://img-blog.csdnimg.cn/20210322174306542.png">![docker架构](https://img-blog.csdnimg.cn/20210322174306542.png)</a>

## Docker常用指令

### 容器管理

**创建容器**

``` 
docker run [镜像名]
```

**列表**（展示进程列表）

```
docker ps
```

**启动/停止**

```
docker start/stop
```

**删除**

```
docker rm
```

**改名**

```
docker rename
```

**复制**

```
docker cp
```

**删除停止的容器**

```
docker prune
```

**运行命令**（运行完就退出，运行不完就不退出）

```
docker exec
```

**从容器创建新镜像**（黑箱操作，只能得到结果）

```
docker commit
```

**从容器创建新镜像**（可以看到流程）

```
docker build
```

### 镜像管理

**镜像列表**

```
docker images
```

**镜像删除**

```
docker rmi
docker images prune (将所有不用的镜像删除)
```

**镜像保存**

```
docker save/load
```

**镜像传输**

```
docker pull/push
```

**给镜像打上标签**

```
docker tag
```

### 信息和状态

**日志**

```
docker logs
```

**状态**

```
docker stats
```

**版本**

```
docker version
```

**进程**

```
docker top
```

**元数据**

```
docker inspect
```

**变化**（显示修改了什么文件）

```
docker diff
```

**端口**

```
docker port
```

### 数据卷管理

**创建**

```
docker volume create ...
```

**列表**

```
docker volume ls
```

**元信息**

```
docker volume inspect ...
```

**删除**

```
docker volume rm ...
```

**指定数据卷对应的目录，在run的时候增加-v指定目录**

```
docker run -v
```