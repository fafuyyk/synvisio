'use strict';
module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', './src/app.js'],
    output: {
        path: __dirname + '/build/assets/bundle',
        filename: "bundle.js",
        publicPath: "/assets/bundle"
    },
    devServer: {
        inline: true,
        contentBase: './build',
        port: 8080
    },
    module: {
        rules: require("./rules.config")
    }
}