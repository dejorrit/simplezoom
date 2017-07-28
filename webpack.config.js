/*eslint-env node */
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = () => {
	const env = process.env.NODE_ENV || 'production';

	let webpackConfig = {
		context: path.resolve(__dirname, './src'),
		entry: './simplezoom.js',
		output: {
			path: path.resolve('./dist'),
			publicPath: path.resolve(__dirname),
			filename: 'simplezoom.js',
			library: 'Simplezoom',
			libraryTarget: 'umd',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: [
						/\.eslintrc\.js$/,
						path.resolve('./node_modules'),
					],
					use: [{
						loader: 'babel-loader',
						options: {
							cacheDirectory: env === 'development'
						}
					}],
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(env)
			})
		]
	};

	if (env === 'development') {
		webpackConfig.devtool = 'cheap-eval-source-map';
	}

	if (env === 'production') {
		webpackConfig.devtool = 'source-map';
		webpackConfig.plugins.push(new UglifyJsPlugin({
			sourceMap: true,
			extractComments: true,
		}));
		webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
		webpackConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
	}

	return webpackConfig;
};
