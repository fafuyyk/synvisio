const path = require('path');
var webpack = require("webpack");
'use strict';

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', './src/app.jsx'],
    output: {
        path: __dirname + '/dist',
        filename: "synvisio.js",
        publicPath: "/"
    },
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 8080,
        watchOptions: {
            ignored: [
                path.resolve(__dirname, 'dist'),
                path.resolve(__dirname, 'node_modules')
            ]
        }
    },
    plugins: [new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    })],
    module: {
        rules: require("./rules.config"),
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}