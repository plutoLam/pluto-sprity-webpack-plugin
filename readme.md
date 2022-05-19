# pluto-sprity-webpack-plugin
一个用于生成精灵图的webpack插件

![](https://img.shields.io/badge/author-PlutoLam-f66.svg#crop=0&crop=0&crop=1&crop=1&id=OXVaV&originHeight=20&originWidth=108&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/version-0.0.2-f66.svg#crop=0&crop=0&crop=1&crop=1&id=Nc47V&originHeight=20&originWidth=90&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/web-%3E%3D%2095%25-3c9.svg#crop=0&crop=0&crop=1&crop=1&id=LyZIm&originHeight=20&originWidth=90&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/node-%3E%3D%208.0.0-3c9.svg#crop=0&crop=0&crop=1&crop=1&id=GoxKU&originHeight=20&originWidth=98&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/test-passing-f90.svg#crop=0&crop=0&crop=1&crop=1&id=b74TK&originHeight=20&originWidth=82&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/build-passing-f90.svg#crop=0&crop=0&crop=1&crop=1&id=iQz3r&originHeight=20&originWidth=88&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/coverage-90%25-09f.svg#crop=0&crop=0&crop=1&crop=1&id=h35xX&originHeight=20&originWidth=96&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://img.shields.io/badge/license-MIT-09f.svg#crop=0&crop=0&crop=1&crop=1&id=PxjBJ&originHeight=20&originWidth=78&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)



该插件会将指定目录下的图片合并成一张精灵图，并生成匹配精灵图的css文件，使用时直接使用css类名即可



### 安装

yarn

```
 yarn add pluto-sprity-webpack-plugin
```



npm

```
npm i pluto-sprity-webpack-plugin
```



### 使用

```js
const path = require("path");
const plutoSprityPlugin = require("pluto-sprity-webpack-plugin");

module.exports = {
	...
	plugins: [
		new plutoSprityPlugin(
			{
				glob: "assets/img/sprite/*.png",
				cwd: path.resolve(__dirname, "src"),
				target: {
					css: "assets/css/sprite.css",
					img: "assets/img/sprite.png"
				}
			})
	]
};
```
配置：
glob（必选）：使用glob规则匹配文件，详情见[glob](https://www.npmjs.com/package/glob)

cwd（必选）：根目录，插件根据根目录匹配文件

target（可选）：

	css：最终生成css的文件（会自动生成目录）

	img：最终生成精灵图的文件




target可以省略，默认的css路径为`assets/css/sprite.css` ，默认的img路径为`assets/img/sprite.png` 
