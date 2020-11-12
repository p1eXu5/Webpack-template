## Задачи, которые решает Webpack.
    
<br/>

1. Следить за порядком подключения скриптов на странице.

    <br/>

    По-сути сейчас 2 точки входа, index.js и analytics.js.

    ```javascript
    const path = require('path'); // аналог Path (C#)

    module.exports = {
        mode: 'development', // bundle.js не будет минифицирован
        entry: './src/index.js', // откуда начать
        output: {
            filename: 'bundle.js', // имя выходного файла
            path: path.resolve(__dirname /*текущая директория*/, 'dist')
        }
    }
    ```
    
    <br/>

    В результате становятся доступны модули, т.е. можно использовать:
    
    ```javascript
    export default ...
    ```
    ```javascript
    import Post from './post'
    ```

    <br/>

    Чтобы добавить точку входа:

    ```javascript
        entry: {
            main: './src/index.js',
            analytics: './src/analytics.js'
        },
        output: {
            filename: '[name].bundle.js'
        ...
    ```
    
<br/>

2. Решение проблем с кешированием файлов в браузере.

    ```javascript
        output: {
            filename: '[name].[contentHash | contenthash].js',
        ...
    ```
    
<br/>

3. Шаблон HTML

    Плагины - дополнительный функционал.

    ```yarn add html-webpack-plugin```

    ```javascript
    const HTMLWebpackPlugin = require('html-webpack-plugin');
    
    ...
    const isProd = !isDev; // isDev см. ниже в CSS

    ...
        plugins: [                              // новый плагин - новый инстанс
            new HTMLWebpackPlugin({             // генерит новый index.html
                title: 'Webpack Crush Course',
                cache: false, // чтобы CleanWebpackPlugin очищал файлы когда watch
                favicon: './assets/favicon.ico',
                minify: {
                    collapseWhitespace: isProd
                }
            }) 
        ]
    ...
    ```
    
    <br/>

    Чтобы взять за основу свой шаблон:

    ```javascript
    ...
        plugins: [                              // новый плагин - новый инстанс
            new HTMLWebpackPlugin({             // генерит новый index.html
                ...
                template: './src/index.html'
            }) 
        ]
    ...
    ```
    
<br/>

4. Очистка ненужных файлов

    ```yarn add clean-webpack-plugin```

<br/>

5. "Настройка, упрощающая создание конфига", т.е. установка BaseDir.

    ```javascript
    module.exports = {
        context: path.resolve(__dirname /*текущая директория*/, 'src') | '<абсолютный_путь>', // где лежат исходники нашего приложения
    ```
    
<br/>

## Лоадеры.
    
<br/>

Webpack работает с js, json. Как работать с контентом, типа css, jpeg и прочее - не его задача.
Чтобы подключить дополнительный функционал для контента нужны лоадеры:


6. CSS

    ```javascript
    module.exports = {
        ...
        module: {
            rules: [
                {
                    test: /\.css$/,         // если встречает в импортах такие объекты, то
                    use: [                  // использовать следующие лоадеры
                        'style-loader' /* добавляет стили в секцию head */, 
                        /* <- направление применения */
                        'css-loader' /* позволяет импортировать css в код */] 
                }
            ]
        }
        ...
    }
    ```

    Стили будут инкапсулироваться в html.

7. CSS file structure

    <p>Если мы хотим, чтобы стили хранились в отдельном файле:</p>

    `yarn add -D mini-css-extract-plugin`

    ```javascript
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    module.exports = {
        ...
        plugins: [
            ...
            new MiniCssExtractPlugin( {filename: '[name].[contentHash].css'} )
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [ MiniCssExtractPlugin.loader, 'css-loader' ] 
                },
                ...
            ]
            ...
        }
    ```

    ```javascript
        use: [
            {
                loader: MiniCssExtractPlugin.loader, 
                options: {
                    hmr: isDev,
                    reloadAll: true
                }
            },
            'css-loader' 
        ]
    ```

8. Hot Module Replacement (hmr).

    hmr - hot module replacement, можем изменять определенные сущности без перезагрузки страницы (для development).

     Для cross-platform:
    `yarn add -D cross-env`

    ```json
    "scripts": {
        "dev": "cross-env NODE_ENV=development .\\node_modules\\.bin\\webpack --mode development",
        "build": "cross-env NODE_ENV=production .\\node_modules\\.bin\\webpack --mode production",
        "watch": "cross-env NODE_ENV=development .\\node_modules\\.bin\\webpack --mode development --watch",
        "start": "cross-env NODE_ENV=development .\\node_modules\\.bin\\webpack-dev-server --mode development --open"
    },
    ```

    ```javascript
    const isDev = process.env.NODE_ENV === 'development';
    ```

    При продакшене в этом случае css не будет минифицирован, чтобы это исправить см. п. 17.
    
<br/>


9. Less / Sass

    `yarn add -D less-loader`
    `yarn add -D less`

    `yarn add -D node-sass`
    `yarn add -D sass-loader`

    ```javascript
    module.exports = {
        ...
            rules: [
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDev,
                                reloadAll: true
                            }
                        }, 
                        'css-loader',
                        'less-loader'
                    ] 
                },
    }
    ```
<br/>


10. JSON

    Json webpack оборачевает сам в JSON.parse:

    ```javascript 
    import json from './...';
    ```
<br/>


11. Картинги:

    ```yarn add file-loader```

    ```javascript
    module.exports = {
        ...
        module: {
            rules: [
                ...
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    use: ['file-loader']
                }
            ]
        }
        ...
    }
    ```

    ```javascript 
    import logo from './...'; // // logo is string, path to image file
    ```
<br/>


12. Шрифты:

    `https://www.fontsquirrel.com/tools/webfont-generator`
    ```css
    @import '../assets/fonts/Overpass/stylesheet.css';
    ```

    ```javascript
    module.exports = {
        ...
        module: {
            rules: [
                ...
                {
                    test: /\.(ttf|woff|woff2|eot)$/,
                    use: ['file-loader']
                }
            ]
        }
        ...
    }
    ```
<br/>


13. XML:

    ```javascript
    module.exports = {
        ...
        module: {
            rules: [
                ...
                {
                    test: /\.xml$/,
                    use: ['xml-loader']
                }
            ]
        }
        ...
    }
    ```

    ```javascript 
    import xml from './...';
    ```
<br/>


14. .csv:

    ```javascript
    module.exports = {
        ...
        module: {
            rules: [
                ...
                {
                    test: /\.csv$/,
                    use: ['csv-loader'] // papaprse need to be installed
                }
            ]
        }
        ...
    }
    ```

    ```javascript 
    import csv from './...';
    ```
<br/>


## Resolve

Это объект, который резолвит экстеншены файлов, которые ловит webpack, что позволяет в импорте не указывать расширение. Если `resolve` не указан, то работает по дефолту.

```javascript
module.exports = {
    ...
    resolve: {
        extensions: [...]
    }
    ...
}
```

Алиасы - способ укоротить путь до файла:

```javascript
module.exports = {
    ...
    resolve: {
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': ...
        }
    }
    ...
}
```

```javascript
import model from '@models/model'
```
<br/>


16. 3rd parts

    ```javascript
    import * as $ from 'jquery'
    ```
<br/>


17. Оптимизация.

    Если импорт одной библы в 2-х точках входа, то она будет присутствовать в обоих бандлах. Чтобы этого избежать:

    ```javascript
    module.exports = {
        ...
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        }
        ...
    }
    ```
    После чего появятся vendors~-файлы.

    <br/>

    Если используются terser-webpack-plugin и optimize-css-assets-webpack-plugin, то:

    `yarn add -D terser-webpack-plugin`
    `yarn add -D optimize-css-assets-webpack-plugin`

    ```javascript
    const TerserWebpackPlugin = require('terser-webpack-plugin');
    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');    
    ```

    ```javascript
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
    ...
     module.exports = {
        ...
        optimization: optimization()
     }

    ```
<br/>


18. JS Minification


    ```javascript
    
    ```
<br/>


19. Dev-сервер

    Например, чтобы вручную не обновлять страницу после изменений.

    `yarn add -D  webpack-dev-server`

    ```javascript
    module.exports = {
        ...
        devServer: {
            port: 4200,
            hot: isDev,
            historyApiFallback: true // для того, чтобы роуты работали после обновления
        },
        ...
    }
    ```

    ```json
    {
        ...
        "scripts": {
            ...
            "start": ".\\node_modules\\.bin\\webpack-dev-server --mode development --open"
        },
        ...
    }
    ```
    Все бандлы складывает в оперативную память, а не в dist, ну шоб шустрее было, типо.

<br/>


20. Копирование файлов

    `yarn add -D copy-webpack-plugin`

    ```javascript
    const CopyWebpackPlugin = require('copy-webpack-plugin');

    module.exports = {
        ...
        plugins: [
            ...
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, 'src/favicon.ico')
                    to: path.resolve(__dirname, 'dist')
                }
            ]),
            ...
        ]
        ...
    }
    ```



<br/>

21. Babel.

    `yarn add -D babel-loader` <br/>
    `yarn add -D @babel/core` <br/>
    `yarn add -D @babel/preset-env`

    Setup см.: https://babeljs.io/setup#installation

    Пресет - набор предопределённых плагинов.

    * Чтоб работал async/await и т.п.: <br/>
    
        `yarn add @babel-polyfill`

        ```javascript
        module.exports = {
            ...
            entry: {
                main: ['@babel/polyfill', './index.js'],
            ...
        }
        ```

    * Proposal JS:

        `yarn add -D @babel/plugin-proposal-class-properties`

        ```javascript
        module.exports = {
            ...
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
            ...
        }
        ```

    * TypeScript:
        
        `yarn add -D @babel/preset-typescript`

        ```javascript
        module.exports = {
            ...
            module: {
                rules: [
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
            ...
        }
        ```

    * React:

        `yarn add -D @babel/preset-react` <br/>
        `yarn add react` <br/>
        `yarn add react-dom` <br/>

    * Fable.React

        ```json
        "devDependencies": {
            "@babel/core": "^7.12.3",
            "fable-compiler": "^2.13.0",
            "fable-loader": "^2.1.9",
            "react-router-dom": "^5.2.0",
            ...
        ```

<br/>

21. Devtool.

    https://webpack.js.org/configuration/devtool/

    ```javascript
    module.exports = {
        // ...
        devtool: isDev ? 'source-map' : ''
    ```

<br/>

22. Analysis

    `yarn add -D webpack-bundle-analyzer` <br/>

    ```json
    {
        ...
        "stats": "cross-env NODE_ENV=stats .\\node_modules\\.bin\\webpack --json > stats.json && .\\node_modules\\.bin\\webpack-bundle-analyzer stats.json"
    }
    ```

    ```javascript
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

    // ...
        if (isProd) {
            base.push( new BundleAnalyzerPlugin() );
        }
    // ...
    ```


<br/>

-------------------------------------
<br/>

## Заметки.

-D "devDependencies" - зависимости для разработки
-S "dependencies" - зависимости для приложения (для npm, для yarn - поведение по-умолчанию)

Т.к. мы не публикуем приложение как npm packet, то в package.json:

- убираем `"main": "index.js",`
- добавляем `"private": true,`


Пакет для нормализации стилей (добавляет общие и fix-стили):

`yarn add normalize.css`

```css
@import '~normalize.css';
```