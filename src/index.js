const chokidar = require("chokidar");
const path = require("path");
const { name: pluginName } = require("../package.json");
const templater = require("spritesheet-templates");

const { getPaths, spritesmithRun, writrFile } = require("./util");
class plutoSprityPlugin {
	constructor(options) {
		this._options = options;
		if (!this._options.target) {
			this._options.target = {};
		}
		this._options.target.css = this._options.target.css || "assets/css/sprite.css";
		this._options.target.img = this._options.target.img || "assets/img/sprite.png";
	}
	getWatcher(cb) {
		if (!this._watcher) {
			this._watcher = chokidar.watch(this._options.glob, {
				cwd: this._options.cwd,
				ignoreInitial: true, // 忽略首次文件变更
				...this._options.options
			});
			this._watcher.on("all", (event, path) => {
				console.log("event, path: ", event, path);
				typeof cb === "function" && cb();
			});
		} else {
			typeof cb === "function" && cb();
		}
	}
	apply(compiler) {
		compiler.hooks.run.tap(pluginName, compiler => {
			this.generateSprite();
		});

		compiler.hooks.watchRun.tap(pluginName, compiler => {
			this.getWatcher(() => { // 第一次编译时，有几个文件他就调用几次，所以第一次编译时不能执行回调函数
				this.generateSprite();
			});
			return this.generateSprite();
		});
	}
	async generateSprite(cb) {
		const paths = await getPaths(this._options.glob, this._options.cwd);
		const sourcePaths = paths.map(v => path.resolve(this._options.cwd, v));
		const spritesRes = await spritesmithRun(sourcePaths);
		const imgPath = path.resolve(this._options.cwd, this._options.target.img);
		const cssPath = path.resolve(this._options.cwd, this._options.target.css);
		// 相对路径
		const cssToImg = path.normalize(path.relative(path.dirname(cssPath), imgPath));
		if (spritesRes.image) {
			await writrFile(imgPath, spritesRes.image);
		}
		const spritesheetObj = Object.entries(spritesRes.coordinates).reduce((v, t) => {
			v.push({
				name: path.parse(t[0]).name,
				...t[1]
			});
			return v;
		}, []);
		const templaterRes = templater({
			sprites: spritesheetObj,
			spritesheet: {
				...spritesRes.properties,
				image: cssToImg // css文件中读取精灵图的路径
			}
		});
		await writrFile(cssPath, templaterRes);
	}
}

module.exports = plutoSprityPlugin;