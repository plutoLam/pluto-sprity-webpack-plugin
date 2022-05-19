const path = require("path");
const plutoSprityPlugin = require("pluto-sprity-webpack-plugin");

module.exports = {
	mode: "development",
	entry: {
		main: path.resolve(__dirname, "./index.js")
	},
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "./dist")
	},
	plugins: [
		new plutoSprityPlugin(
			{
				glob: "assets/img/sprite/*.png",
				cwd: path.resolve(__dirname, "src")
			})
	]
};