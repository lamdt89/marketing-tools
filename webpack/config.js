const path = require('path')
const { merge } = require('webpack-merge')
const Dotenv = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const alias = require('./alias')

const config = merge(alias, {
    entry: {
        main: [path.join(__dirname, '../', 'src/app')],
        injection: {
            import: path.join(__dirname, '../', 'src/injector'),
            filename: 'js/injector.js'
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
        path: path.join(__dirname, '../', '.dist'),
        filename: 'vnt-mp-campaign.js'
    },
    plugins: [new CleanWebpackPlugin(), new Dotenv()],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({ extractComments: false })]
    }
})

module.exports = config
