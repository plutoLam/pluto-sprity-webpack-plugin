const chokidar = require("chokidar");

const { name: pluginName } = require("../package.json");
class plutoSprityPlugin {
	constructor(options) {
		this._options = options;
	}
	getWatcher(cb) {
		if (!this._watcher) {
			this._watcher = chokidar.watch(this._options.glob, {
				cwd: this._options.cwd,
				ignoreInitial: true, // 忽略首次文件变更
				...this._options.options
			});
			// console.log(this._watcher);
			this._watcher.on("all", (event, path) => {
				console.log("event, path: ", event, path);
				typeof cb === "function" && cb();
			});
		}
	}
	apply(compiler) {
		compiler.hooks.run.tap(pluginName, compilation => {
			console.log("生命周期run");
			this.getWatcher();
			this.generateSprite(() => {
				console.log("执行gen回调");
			});
		});

		compiler.hooks.watchRun.tap(pluginName, compiler => {
			console.log("生命周期watchRun");
			this.getWatcher(() => { // 第一次编译时，有几个文件他就调用几次，所以第一次编译时不能执行回调函数
				console.log("文件发生变动，重新生成精灵图");

				this.generateSprite();
			});
			return this.generateSprite();
		});
	}
	generateSprite(cb) {
		console.log("生成精灵图");

		// ...异步执行完后
		setTimeout(() => {
			typeof cb === "function" && cb();
		}, 2000);
	}
}

module.exports = plutoSprityPlugin;