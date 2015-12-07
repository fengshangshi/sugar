/**
 * @file 服务器命令
 * @author fengshangshi
 */
var fs = require('fs');
var path = require('path');

module.exports = function(options) {
		var root = process.cwd();
		var configPath = path.join(root, '/sugar-config.json');
		if (!fs.existsSync(configPath)) {
				console.log('当前不存在sugar-config.json，请确定当前目录为开发根目录');
				return;
		}

		var target = options.target;
		var watch = options.watch;

		if (watch) {
				require('./release/watch')(root, target);
		} else {
				require('./release/release')(root, target);
		}
};

