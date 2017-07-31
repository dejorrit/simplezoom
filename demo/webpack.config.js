/*eslint-env node */
const path = require('path');
const webpack = require('webpack');

module.exports = () => {
	const env = process.env.NODE_ENV || 'production';

	return webpackConfig = {
		context: path.resolve(__dirname, './src'),
		entry: './demo.js',
		output: {
			path: path.resolve('./dist'),
			publicPath: path.resolve(__dirname),
			filename: 'demo.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: [
						path.resolve('./node_modules'),
					],
					use: [{
						loader: 'babel-loader'
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
};
