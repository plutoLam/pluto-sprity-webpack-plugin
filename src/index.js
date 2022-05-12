
class plutoSprityPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap("pluto-sprity-plugin", compilation => {
			compilation.hooks.buildModule.tap("pluto-sprity-plugin", (data, cb) => {
				console.log(data);
			});
		});
	}
}

module.exports = plutoSprityPlugin;