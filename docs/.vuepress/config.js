module.exports = {
    title: 'Mich\'s Blog', 
    description: 'The road to the strong', 
    head: [
        ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js' }],
        ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js' }],
        ['link', { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css' }],
        ['link', { rel: 'icon', href: '/logo.jpg' } ]
    ],

    themeConfig: {
        serviceWorker: {
            updatePopup: true,
            //将开启一个能够刷新内容的弹窗。当网站更新（即 Service Worker 更新）时，它会提供一个 refresh 按钮，允许用户立刻刷新内容。
            // 如果设置为 true, 默认的文本配置将是:  
            updatePopup: {
              message: "有新的资源可用",
              buttonText: "点击刷新"
            }
        },
        lastUpdated: 'Last Updated',
        logo: '/logo.jpg',
        nav: [
            { text: '首页', link: '/'},
            {
                text: '技术',
                ariaLabel: '技术', 
                items: [
                    { text: 'React', link: '/pages/react/rtLearn1.md' },
                    { text: 'Vue', link: '/pages/vue/vLearn1.md' },
                    { text: 'Redux', link: '/pages/redux/rdLearn.md' },
                    { text: 'React-Native', link: '/pages/reactNative/means/rnMeans1.md' },
                    { text: 'Taro', link: '/pages/taro/learn/trLearn1.md' },
                    { text: 'CSS', link: '/pages/css/learn/cssLearn1.md' },
                    { text: 'JavaScript', link: '/pages/javaScript/jsLearn1.md' },
                    { text: 'TypeScript', link: '/pages/typeScript/learn/tsLearn1.md' },
                    { text: 'Egret游戏开发', link: '/pages/egret/means/egMeans1.md' },
                    { text: 'Python爬虫', link: '/pages/python/demo/crawler1.md' },
                    { text: 'Webpack', link: '/pages/webpack/wpLearn1.md'}
                ]
            },
            {
                text: '爱好', 
                ariaLabel: '摄影', 
                items: [
                    { text: '摄影', link: '/pages/shoot/imgShow191001.md' }
                ]
            },
            { 
                text: '上线作品', 
                ariaLabel: '上线作品', 
                items: [
                    { text: '商人奇遇记', link: 'http://www.4399.com/flash/208072.htm' },
                    { text: '就爱来找茬', link: 'http://www.4399.com/flash/209642.htm' },
                    { text: '垃圾分类大挑战', link: 'http://www.4399.com/flash/210824.htm' },
                ] 
            },
            { text: 'Github', link: 'https://github.com/KoWhite'}
        ],

        sidebar: {
            '/pages/': [
                {
                    title: 'react.js',
                    collapsable: true,
                    children: [
                        ['react/rtLearn1.md', 'styled-components在react中的使用']
                    ]
                },
                {
                    title: 'vue.js',
                    collapsable: true,
                    children: [
                        ['vue/vLearn1.md', '基础语法'],
                        ['vue/vxLearn.md', 'vuex的使用']
                    ]
                },
                {
                    title: 'redux',
                    collapsable: true,
                    children: [
                        ['redux/rdLearn.md', 'redux用法'],
                        ['redux/redux-mid.md', 'redux中间件'],
                        ['redux/react-redux.md', '扩展-(react-redux)']
                    ]
                },
                {
                    title: 'react-native',
                    collapsable: true,
                    children: [
                        ['reactNative/means/rnMeans1.md', '搭建项目遇到的坑'],
                        ['reactNative/means/rnMeans2.md', 'ReactNative报错null is not an object (evaluating \'_rngesturehandlermodule.default.direction\')'],
                        ['reactNative/means/rnMeans3.md', 'Invariant Violation:The navigation prop is missing for this navigator,In react-navigation 3.......']
                    ]
                },
                {
                    title: 'taro',
                    collapsable: true,
                    children: [
                        ['taro/learn/trLearn1.md', 'Taro初探知识点整理']
                    ]
                },
                {
                    title: 'css',
                    collapsable: true,
                    children: [
                        ['css/learn/cssLearn1.md', '《CSS权威指南》知识点整理']
                    ]
                },
                {
                    title: 'egret游戏开发',
                    collapsable: true,
                    children: [
                        ['egret/learn/egLearn1.md', 'egret搭建项目流程'],
                        ['egret/means/egMeans1.md', 'egret滤镜方法ColorMatrixFilter使用'],
                        ['egret/means/egMeans2.md', '计算当天最后一秒的时间戳（签到等功能）']
                    ]
                },
                {
                    title: 'JS',
                    collapsable: true,
                    children: [
                        ['javaScript/jsLearn1.md', 'Array.reduce() 使用过程'],
                    ]
                },
                {
                    title: 'TS',
                    collapsable: true,
                    children: [
                        ['typeScript/learn/tsLearn1.md', '基础类型'],
                        ['typeScript/learn/tsLearn2.md', '接口'],
                        ['typeScript/learn/tsLearn3.md', '类'],
                        ['typeScript/learn/tsLearn4.md', '函数'],
                        ['typeScript/learn/tsLearn5.md', '泛型']
                    ]
                },
                {
                    title: 'python爬虫',
                    collapsable: true,
                    children: [
                        ['python/demo/crawler1.md', '深入浅出Python爬虫（静态）']
                    ]
                },
                {
                    title: 'webpack',
                    collapsable: true,
                    children: [
                        ['webpack/wpLearn1.md', 'webpack入门'],
                        ['webpack/wpLearn2.md', 'webpack高级用法'],
                        ['webpack/wpLearn3.md', 'webpack构建配置']
                    ]
                }
            ],
            '/pages/shoot/': [
                {
                    title: '以期为记',
                    collapsable: false,
                    children: [
                        ['imgShow191001.md', '2019/10/1(云南)'],
                        ['imgEarlier.md', '更早之前']
                    ]
                }
            ],
        }
    }
}
