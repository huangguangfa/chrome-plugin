const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");  
const WebpackBar = require('webpackbar');
const { version } = require('./package');
module.exports = {
    //模式
    mode: 'development', // development | production
    //入口配置
    entry: {
        'core/serve/index':'./src/core/serve/index.js',
        'browserAction/js/vm':'./src/browserAction/js/vm.js',
        'core/contentScript/install':'./src/core/contentScript/install.js',
        'core/contentScript/network':'./src/core/contentScript/network.js'
    },
    // 输出配置
    output: {
        // 输出路径
        path: path.join(__dirname, version),
        // 输出文件名
        filename: '[name].js'
    },
    // loader配置
    module: {
       // 处理规则
        rules: [
            {
                // 处理css资源
                test: /\.css$/,
                // 执行顺序：从后向前依次执行（也可说从右往左，从下往上）
                use: [
                    'style-loader', // 创建style标签，将js中的样式资源插入到style标签并添加到head标签
                    'css-loader' // 将css资源编译成commonjs模块加载到js中，但仍然保持样式字符串的形式
                ]
            },
            {
                // 处理less资源
                test: /\.less$/,
                // 执行顺序：从后向前依次执行（也可说从右往左，从下往上）
                use: [
                    'style-loader', // 创建style标签，将js中的样式资源插入到style标签并添加到head标签
                    'css-loader', // 将css资源编译成commonjs模块加载到js中，但仍然保持样式字符串的形式
                    'less-loader' // 将less资源编译成css资源
                ]
            },
            {
                // 处理图片资源
                test: /\.(jpe?g|png|gif)$/,
                // 注意：一个loader可直接使用loader选项，多个选项需要使用use: [loader1,loader2]
                loader: 'url-loader', // 处理样式文件中url引入图片的方式(通过background-image)
                options: {
                  limit: 8 * 1024, // 当图片小于8kb时会当做base64处理(减少请求数，以减轻服务器压力，但图片体积会增大而影响文件速度)
                  esModule: false,  // 默认url-loader采用的是es6的模块化解析方式，而html-loader@0.5.5采用的commonjs规范引入图片，解析后会出现[Object Module]的问题
                  // 解决办法(两种)：1）升级html-loader为1.0.0；2）关闭url-loader的es6模块解析方式
                  name: '[hash:8].[ext]' // 修改图片资源的名称(取图片hash前8位)和对应的后缀名
                }
            },
            {
                // 处理html中引入图片资源
                test: /\.html?$/,
                loader: 'html-loader' // 处理html中img引入图片的方式(处理完成后交给url-loader)
            }
        ]
    },
    // 插件配置
    plugins: [
        //打包进度条
        new WebpackBar({
            name:'完成打包'
        }),
        new CopyPlugin({
            patterns: [
              { from: "./src/icons", to: "icons" },
              { from: "./src/plugin", to: "plugin" },
              { from: "./manifest.json", to: "manifest.json" },
              { from: "./src/core/serve/index.html", to: "core/serve/index.html" },
              { from: "./src/browserAction/index.html", to: "browserAction/index.html" },
              { from: "./src/browserAction/no_plugin.html", to: "browserAction/no_plugin.html" },
              { from: "./src/browserAction/css", to: "browserAction/css" },
            ]
        })
    ]
}