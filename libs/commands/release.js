/**
 * @file 服务器命令
 * @author fengshangshi
 */
module.exports = function(options) {
		var target = options.target;
		var watch = options.watch;

		if (watch) {
				require('./release/watch')(target);
		} else {
				require('./release/release')(target);
		}
};

