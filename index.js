const liveServer = require('live-server')
const middleware = []
var Renderer = require('./docsify-server-renderer-fix')
var readFileSync = require('fs').readFileSync

var renderer = new Renderer({
    template: readFileSync('./ssr.html', 'utf-8'),
    config: {
        name: '多看Blog',
        repo: 'ayu-666/blog',
        basePath: "../blog",
        pagination: {
            previousText: '上一章节',
            nextText: '下一章节',
            crossChapter: true,
            crossChapterText: true,
        },
        toc: {
            scope: '.markdown-section',
            headings: 'h1, h2, h3, h4, h5, h6',
            title: '&nbsp;',
        },
        formatUpdated: '{YYYY}/{MM}/{DD} {HH}:{mm}:{ss}',//文档更新日期变量{docsify-updated}格式化，格式参考https://github.com/lukeed/tinydate#patterns
        loadSidebar: true,
        subMaxLevel: 2,
        auto2top: true,// 切换文档自动回顶部
        search: {
            maxAge: 86400000,// 索引过期时间，单位毫秒，默认一天
            paths: 'auto',
            placeholder: '搜索',
            noData: '找不到结果',
            depth: 3,// 搜索标题的最大层级, 1 - 6
            hideOtherSidebarContent: false, // 是否隐藏其他侧边栏内容
        },
        count: {countable: true, fontsize: '0.9em', color: 'rgb(90,90,90)', language: 'chinese'},
    }
})
middleware.push(function (req, res, next) {
    console.log('req.url', req.url)
    if (/\.(css|js)$/.test(req.url)) {
        return next()
    }
    renderer.renderToString(req.url).then(html => res.end(html)).catch(err => console.error(err))
})

const params = {
    port: 3000,
    watch: ['lib', 'docs', 'themes'],
    open: false,
    middleware
}

liveServer.start(params)
