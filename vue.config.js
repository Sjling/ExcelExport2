const path = require('path');
const target = 'http://white.natapp4.cc';
// const webpack = require('webpack');
function resolve (dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    baseUrl: '/',// 部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)
    outputDir: 'dist',// 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除) ----打包
    assetsDir: 'static',//放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')  ----打包
    lintOnSave: process.env.NODE_ENV !== 'production',// 是否在保存的时候检查 生产构建时禁用 eslint-loader, lintOnSave: process.env.NODE_ENV !== 'production'
    productionSourceMap: false, // 默认为true, 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    // 配置别名
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'));
    },
    // configureWebpack: {
    //     plugins: [
    //         new webpack.DefinePlugin({
    //             'DEV_NAME': NODE_NAME
    //         })
    //     ]
    // },;
    devServer: {// 环境配置
        https: false,
        hotOnly: false,
        overlay: {
            warnings: false,
            errors: true
        },
        open: true, //配置自动启动浏览器
        proxy: {// 配置多个代理(配置一个 proxy: 'http://localhost:4000' )
            '/api': {
                target: target,
                pathRewrite: { '^/api' : '/api' }
            }
        }
    }
};
