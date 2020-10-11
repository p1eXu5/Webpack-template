const path = require('path'); // аналог Path (C#)
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const isStats = process.env.NODE_ENV === 'stats'

if (!isStats) {
    console.log('// ------------------------- debug -------------------------')
    console.log('// Is dev: ', isDev);
    console.log('// ---------------------------------------------------------')
}

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if ( isProd ) {
        // переписать базовые оптимизаторы
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const plugins = () => {
    const base =  [
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, 'src/favicon.ico')
        //         to: path.resolve(__dirname, 'dist')
        //     }
        // ]),
        new HTMLWebpackPlugin({
            template: "./index.html",
            cache: false, // чтобы CleanWebpackPlugin очищал файлы когда watch
            favicon: "./assets/favicon.ico",
            minify: {
                collapseWhitespace: isProd,
            },
        }), // новый плагин - новый инстанс
        new MiniCssExtractPlugin({ filename: "[name].[hash].css" }),
    ]

    if (isProd) {
        base.push( new BundleAnalyzerPlugin() );
    }

    return base;
}


module.exports = {
    context: path.resolve(__dirname /*текущая директория*/, "src"), // где лежат исходники нашего приложения
    mode: "development", // bundle.js не будет минифицирован
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analytics: "./analytics.ts",
    }, // откуда начать
    output: {
        filename: "[name].[hash].js", // имя выходных файлов
        path: path.resolve(__dirname /*текущая директория*/, "dist"),
    },
    devServer: {
        port: 4200,
        hot: isDev,
    },
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "@babel/preset-typescript" ],
                    },
                },
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "@babel/preset-react" ],
                    },
                },
            },
            {
                test: /\.css$/, // если встречает в импортах такие объекты, то
                //use: ['style-loader' /* добавляет стили в секцию head */, /* <- направление применения */ 'css-loader' /* позволяет импортировать css в код */] // использовать следующие лоадеры
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        },
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ["file-loader"],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ["file-loader"],
            },
        ],
    },
    optimization: optimization(),
    devtool: isDev ? 'source-map' : ''
};