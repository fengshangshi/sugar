/**
 * @file 初始化命令
 * @author fengshangshi
 */
module.exports = function(name, options) {
	var target = options.target;
	var source = options.source;
	switch (name) {
		case 'server':
			require('./init/server')(target, source);
			break;
		case 'app':
			require('./init/app')(process.cwd(), source);
			break;

		default:
			console.log('just init server or app');
	}
};
