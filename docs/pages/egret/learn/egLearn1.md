本文将总结使用Egret开发2D游戏的搭建项目流程，从搭环境到制作一个项目模板，快速开发一个游戏的基础：
## 准备
首先需要在本地建立一个游戏开发的环境，这里建议去[Egret官网](https://www.egret.com/products/)，Egret Engine是必备的，可以先下载安装Egret Engine而后在软件里安装其它工具，安装好之后我们需要安装Egret Wing，未来将在这个IDE里编写我们游戏的相关代码，所以以上两个工具是必须的。

除了以上两个工具，还需根据项目判断是否使用其他工具，这里简略介绍下其它工具的功能：

::: tip Texture Merger
1. 生成**雪碧图**，egret可直接使用；
2. 生成**帧动画**，输出文件egret可直接使用；
3. 生成**位图**，输出文件egret直接使用。
:::

::: tip DragonBones
此工具最主要的功能是**制作龙骨动画**
:::
::: tip Egret Feather
此工具可以制作**精美的粒子动画**
:::

剩下的其它工具可以参考官方文档

## 初探
打开Egret Launcher, 我们需要先安装引擎，如果项目没有特别要求，我们可以安装最新版本的，如下图：
<a data-fancybox title="引擎" href="https://img-blog.csdnimg.cn/20200304101933272.png">![引擎](https://img-blog.csdnimg.cn/20200304101933272.png)</a>

安装完成之后开始搭建项目：进入项目栏，点出创建项目会弹出一个设置页面，这个页面很重要，接下来介绍细节

<a data-fancybox title="创建项目" href="https://img-blog.csdnimg.cn/20200304102642543.png">![创建项目](https://img-blog.csdnimg.cn/20200304102642543.png)</a>

项目名称，项目路径字面意思

项目类型中包括(旧版本)
1. egret游戏项目；
2. egret EUI项目；
这里的两个项目最主要的不同是初始化库的不同，一般开发使用EUI项目即可。新版本好像合并了。

选择扩展库: 这个里根据项目选择对应的扩展库，如果你在创建项目的时候没有选择，在之后也可以在**egretProperties.json**里面配置，简单介绍下几个库的功能:
::: tip 扩展
1. **dragonbones龙骨动画库**： 在使用龙骨动画的时候才使用；
2. **game游戏库**：这个最好选上，因为game库很常用，使用方式移步官方文档；
3. **socket 网络通讯库**，egret有封装WebScoket，前后端WS或者WSS通信可以选上。
:::

接下来的几项根据项目选择，一般没啥用。

::: warning 注意
舞台尺寸、缩放模式、旋转方式根据你的UI图或者项目设计选择，当然这些在后期如果需要修改可以通过入口文件**index.html**。
:::

完成之后点击创建来到我们的下一步

## 项目结构介绍
<a data-fancybox title="项目结构" href="https://img-blog.csdnimg.cn/20200304105759222.png">![项目结构](https://img-blog.csdnimg.cn/20200304105759222.png)</a>

## 主文件介绍（Main.ts)
<a data-fancybox title="Main.ts" href="https://img-blog.csdnimg.cn/20200304110729108.png">![Main.ts](https://img-blog.csdnimg.cn/20200304110729108.png)</a>

理一下搭建项目的整体脉络：
::: danger 搭建过程
**下载必须软件工具 -> Egret Engine 安装引擎 -> Egret Engine 创建项目 -> 项目配置 -> 创建完成修改项目目录**
:::

egret搭建项目的流程基本介绍完，egret使用TypeScript编写代码，提供可视化页面编辑，把制作中心放在逻辑上，在玩游戏中根本没感觉每个功能有多少逻辑点，只有开发游戏才知道每个需求制作也不是那么容易的。使用Egret开发过程中，开发模式较宽泛，每个模块传值方式比较方便，这些还是要多次开发积累下来的经验，所以与其纸上谈兵，不如实操一番来的实在。

以上。







