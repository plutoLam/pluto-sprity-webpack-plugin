const chokidar = require("chokidar");
const path = require("path");
const { name: pluginName } = require("../package.json");
const templater = require("spritesheet-templates");

const { getPaths, spritesmithRun, writrFile } = require("./util");
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
		} else {
			typeof cb === "function" && cb();
		}
	}
	apply(compiler) {
		compiler.hooks.run.tap(pluginName, compilation => {
			console.log("生命周期run");
			this.generateSprite(() => {
				console.log("执行gen回调");
			});
		});

		compiler.hooks.watchRun.tap("随便搞一个", compiler => {
			console.log("生命周期watchRun");
			this.getWatcher(() => { // 第一次编译时，有几个文件他就调用几次，所以第一次编译时不能执行回调函数
				console.log("文件发生变动，重新生成精灵图");

				this.generateSprite();
			});
			return this.generateSprite();
		});
	}
	async generateSprite(cb) {
		console.log("生成精灵图");

		const paths = await getPaths(this._options.glob, this._options.cwd);
		/*
			paths:  [
			'assets/img/sprite/cd/red@2x.png',
			'assets/img/sprite/red.png',
			'assets/img/sprite/turquoise.png',
			'assets/img/sprite/turquoise@2x.png'
		]
		*/
		const sourcePaths = paths.map(v => path.resolve(this._options.cwd, v));
		const spritesRes = await spritesmithRun(sourcePaths);
		/*
			spritesRes:  {
			coordinates: {
				'D:\\1-front-end\\netease\\pluto-sprity-plugin\\test\\src\\assets\\img\\sprite\\cd\\red@2x.png': { x: 0, y: 0, width: 34, height: 34 },
				'D:\\1-front-end\\netease\\pluto-sprity-plugin\\test\\src\\assets\\img\\sprite\\red.png': { x: 0, y: 34, width: 17, height: 17 },
				'D:\\1-front-end\\netease\\pluto-sprity-plugin\\test\\src\\assets\\img\\sprite\\turquoise.png': { x: 17, y: 34, width: 17, height: 17 },
				'D:\\1-front-end\\netease\\pluto-sprity-plugin\\test\\src\\assets\\img\\sprite\\turquoise@2x.png': { x: 34, y: 0, width: 34, height: 34 }
			},
			properties: { width: 68, height: 51 },
			image: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 00 44 00 00 00 33 08 06 00 00 00 2e 34 ae cb 00 00 00 02 49 44 41 54 78 01 ec 1a 7e d2 00 00 0a ... 2803 more bytes>
		}
		*/
		const imgPath = path.resolve(this._options.cwd, "assets/img/sprite.png");
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
		/*
			spritesheetObj:  [
			{ name: 'red.png', x: 34, y: 0, width: 17, height: 17 },
			{ name: 'turquoise.png', x: 34, y: 17, width: 17, height: 17 },
			{ name: 'turquoise@2x.png', x: 0, y: 0, width: 34, height: 34 }
		]
		*/
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