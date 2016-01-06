/**
 * @file 初始化应用程序环境
 * @author fengshangshi
 */
var fs = require('fs-extra');
var Scaffold = require('sugar-template-scaffold');

var conf = require('../../../config/scaffold');

var suffixMap = {
	'gitlab': '.git',
	'github': '-master'
};

module.exports = function(target, source) {
	var type = conf.app[source] || 'gitlab';
	var config = conf.app[type];
	var id = config['repos'];

	var template = id.split('/')[1];

	console.log('应用程序目录初始化开始');
	console.log('正在下载模板...');
	var scaffold = new Scaffold({
		type: type
	});

	scaffold.download(
		id,

		function(err, src) {
			if (err) {
				console.log('下载模板失败: ' + err);
				return;
			}

			console.log('下载模板完成');
			console.log('开始复制文件...');

			var suffix = suffixMap[type] || '-master';

			src += ('/' + template + suffix);
			fs.copy(src, target, function(err) {
				if (err) {
					console.log('复制文件失败: ' + err);
					return;
				}

				console.log('文件复制完成');
				console.log('应用程序目录初始化成功');
				console.log('执行命令：sugar release, 将代码发布至服务器');
			});
		},

		function(progress, loaded, total) {
			if (total <= 0) return false;
			progress = (progress * 100).toFixed(2);
			process.stdout.clearLine();
			process.stdout.write('模板已经加载: ' + progress + '%');
			process.stdout.cursorTo(0);
			if (loaded === total) {
				process.stdout.clearLine();
			}
		}
	);
};
