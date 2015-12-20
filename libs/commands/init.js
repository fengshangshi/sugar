/**
 * @file 初始化命令
 * @author fengshangshi
 */
module.exports = function(name, options) {
	var target = options.target;
	switch (name) {
		case 'server':
			require('./init/server')(options.target);
			break;
		case 'app':
			require('./init/app')(process.cwd());
			break;

		default:
			console.log('just init server or app');
	}
};
