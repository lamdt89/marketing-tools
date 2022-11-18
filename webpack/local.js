const path = require('path')
const { merge } = require('webpack-merge')
const Dotenv = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const alias = require('./alias')

const config = merge(alias, {
    entry: {
        main: [path.join(__dirname, '../', 'src/app')],
        injection: {
            import: path.join(__dirname, '../', 'src/injector'),
            filename: 'injector.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.worker\.(c|m)?js$/i,
                use: [
                    {
                        loader: 'worker-loader',
                        options: { inline: 'fallback' }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        mainFields: ['browser', 'main', 'module'],
        extensions: ['.js', '.scss', '.css', '.html', '.json', '.webpack.js', '.web.js', '.mjs']
    },
    output: {
        path: path.join(__dirname, '../', 'public/dist'),
        filename: 'vnt-mp.js'
    },
    plugins: [new CleanWebpackPlugin(), new Dotenv()],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({})]
    }
})

const configLocal = merge(config, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hello Webpack bundled JavaScript Project',
            template: path.join(__dirname, '../', 'src/index.html')
        })
    ],
    devServer: {
        // contentBase: path.join(__dirname, '../' , '.dist'),
        // publicPath: path.join(__dirname, '../' , '.dist')
    }
})

module.exports = configLocal
