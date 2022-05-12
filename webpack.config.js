// webpack.config.js

const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const plutoSprityPlugin = require("./src/index"); // +++ 引入我们写的plugin

module.exports = {
	mode: "development",
	entry: {
		main: path.resolve(__dirname, "./src/index.js")
	},
	output: {
		filename: "main.js", // +++ 打包的文件不再需要 hash
		path: path.resolve(__dirname, "./dist")
	},
	plugins: [
		// new HtmlWebpackPlugin({
		// 	template: path.resolve(__dirname, "./index.html")
		// }),
		// new CleanWebpackPlugin(),
		new plutoSprityPlugin() // 使用我们的plugin
	]
};