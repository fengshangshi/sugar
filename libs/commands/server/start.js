/**
 * @file 启动服务器
 * @author fengshangshi
 */
var cp = require('child_process');

module.exports = function(config) {
		var bin = config['bin'];

		var e = cp.spawn(bin, ['start']);
};
