const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageObj = require('./package.json');
const name = packageObj.name;

function getPlugin() {
    const plugins = [
        new webpack.SourceMapDevToolPlugin({
            filename: name + ".map"
        }),
        new MiniCssExtractPlugin({
            filename: name + ".css"
        })
    ];

    if (process.env.NODE_ENV === 'production') {
        return [
            new webpack.optimize.UglifyJsPlugin(),
        ].concat(plugins);
    } else {
        return plugins;
    }
}

config = {
    optimization: {
        minimize: false
    },
    entry: {
        main: [
            './src/index.ts',
            './src/style/index.scss'
        ]
    },
    output: {
        filename: name + ".js",
        path: path.resolve(__dirname, './dist/')
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.ts', '.js'],
        alias: {}
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                sideEffects: true,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    plugins: getPlugin()
};

module.exports = config;
