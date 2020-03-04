# 深入浅出Python爬虫（静态）
## 1.何为Python爬虫
如果我们把互联网比作一张大的蜘蛛网，数据便是存放于蜘蛛网的各个节点，而爬虫就是一只小蜘蛛沿着网络抓取自己的猎物（数据）爬虫指的是：向网站发起请求，获取资源后分析并提取有用数据的程序；从技术层面来说就是 通过程序模拟浏览器请求站点的行为，把站点返回的HTML代码/JSON数据/二进制数据（图片、视频） 爬到本地，进而提取自己需要的数据，存放起来使用。

## 2.爬虫的基本流程
1. 发起请求

   使用HTTP库向目标站点发起请求，即发送一个Request

   Request包含：请求头、请求体等

   Request模块缺陷：不能执行JS和CSS代码
2. 获取相应内容

   如果服务器能正常相应，则会得到一个Response

   Resonse包含： html、JSON、图片、视频等

3. 解析内容

   第三方库（beautifulSoup4），正则表达式等

   解析JSON数据：JSON模块

   解析二进制数据：以wb的方式写入文件
4. 保存数据

   数据库（MySQL, Mongdb, Redis)

   文件

## 3.demo（爬取静态网页数据）
在开始之前需要搭建一个python的开发环境，包括安装python以及设置环境变量，整个过程较为简单。我们这次要爬的是一个学校的教务部的所有通知，[传送门](http://jwb.xujc.com/tzgg/list.htm),通过查看网页的源码，我们可以知道我们需要通过通知目录的url模拟访问，取得我们需要的每个通知的标题、作者、内容、发布时间等等数据。那我们需要通过拼接url模拟访问。

1. 选择IDE
   
   我使用的是PyCharm，这个IDE有多强大我就不多说了。
   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211114917172.png">![avatar](https://img-blog.csdnimg.cn/20191211114917172.png)</a>

2. 引入所需的包

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211114935603.jpg">![avatar](https://img-blog.csdnimg.cn/20191211114935603.jpg)</a>

   在安装好IDE之后需要引入爬虫需要的用到的包，我这次爬虫主要是针对静态网页爬，主要是用到了，requests、BeautifulSoup4、re。
   ::: tip 提示
   **requests** 可以获取网页的源代码，**bs4**可将网页代码进行处理，**re**是将数据过滤成我们需要的。
   :::

3. 爬取网页相关代码

   获取网页源码

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211114952495.png">![avatar](https://img-blog.csdnimg.cn/20191211114952495.png)</a>

   从上面的代码可以获得以下数据

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115001564.png">![avatar](https://img-blog.csdnimg.cn/20191211115001564.png)</a>

   这么乱的代码我们根本不知道需要爬什么，接下来我们可以通过BS4进行格式化：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115013811.png">![avatar](https://img-blog.csdnimg.cn/20191211115013811.png)</a>

   获得的数据：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115022318.png">![avatar](https://img-blog.csdnimg.cn/20191211115022318.png)</a>

   分析代码可得，我们想获得的通知标题a标签里面的href,那么现在的方案是先取到所有的a标签，然后再获取href,再用正则表达式获取我们需要的href

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115029683.png">![avatar](https://img-blog.csdnimg.cn/20191211115029683.png)</a>

   从上面的代码获取所有的a标签：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115036448.png">![avatar](https://img-blog.csdnimg.cn/20191211115036448.png)</a>

   而后获得所有的href属性：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115042577.png">![avatar](https://img-blog.csdnimg.cn/20191211115042577.png)</a>

   然后经过正则表达式的过滤：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115049743.png">![avatar](https://img-blog.csdnimg.cn/20191211115049743.png)</a>

   分析URL，固定的部分由 `http://jwb.xujc.com${url}page.html`,我们获取了所有标题的URL，就可以写一个方法，对改页面的内容进行解析，获得我们想要的数据：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115058786.png">![avatar](https://img-blog.csdnimg.cn/20191211115058786.png)</a>

   获得通知内容：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115107532.png">![avatar](https://img-blog.csdnimg.cn/20191211115107532.png)</a>

   而后我们可以把数据输出到EXCEL，或者转化成JSON格式输出到TXT

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115114849.png">![avatar](https://img-blog.csdnimg.cn/20191211115114849.png)</a>
   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115122443.png">![avatar](https://img-blog.csdnimg.cn/20191211115122443.png)</a>

   或者生成云图：

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115129144.png">![avatar](https://img-blog.csdnimg.cn/20191211115129144.png)</a>

   当然也可以将爬取到的数据放入数据库，每天定时爬取，并且通过前后端交互渲染在前端，这样就可以达到做一个项目的目的。

   <a data-fancybox title="avatar" href="https://img-blog.csdnimg.cn/20191211115136259.png">![avatar](https://img-blog.csdnimg.cn/20191211115136259.png)</a>

   这是我大学时制作的一个小程序项目，而针对静态网页的数据爬取基本也是这样的一个流程。当然这还有一个前提，你学过python并且知道python的基本语法。而对于爬虫这个技巧，对于我们前端来说是必不可少的能力，也是最容易让自己成为前后通吃高手的路径。我还在路上，要学的东西实在太多了！

   当然静态网站的爬取较为简单，而比较难的是爬取动态网站的数据
   
   ::: tip 指引
   快速入门Python爬虫视频教程：[教程](https://www.bilibili.com/video/av9784617?from=search&seid=12295915262843782172)

   包括动态网站（数据利用AJAX）的网站爬取教程
   :::
   

