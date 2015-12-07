/**
 * @file 停止服务器
 * @author fengshangshi
 */
var cp = require('child_process');

module.exports = function(config) {
		var bin = config['bin'];

		var e = cp.spawn(bin, ['stop']);
};

