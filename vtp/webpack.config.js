const webpack = require('webpack')
const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devtool: 'cheap-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:16].js'
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        disableHostCheck: true,
        proxy: {
            '/ws': {
                target: 'ws://localhost:8880/ws',
                pathRewrite: {
                    '^/ws': ''
                },
                ws: true,
                changeOrigin: true,
                secure: false,
            }
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, 'src'),
            ],
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            options: {
                "presets": [
                    [
                        "@babel/preset-env",
                        {
                            "useBuiltIns": "usage",
                            "modules": false
                        }
                    ],
                ],
                "plugins": [
                    [
                        "@babel/plugin-transform-runtime",
                        {
                            "corejs": false,
                            "helpers": false,
                            "regenerator": false,
                            "useESModules": false
                        }
                    ],
                    [
                        "@babel/plugin-proposal-class-properties",
                    ],
                ],
                "comments": false
            }
        }],
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'MobileTouchPad',
            filename: 'index.html',
            template: path.resolve(__dirname, 'public', 'index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeAttributeQuotes: true,
            },
        }),
    ],
    resolve: {
        extensions: ['.js', '.json']
    },
}