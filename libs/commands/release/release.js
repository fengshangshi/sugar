/**
 * @file 发布代码
 * @author fengshangshi
 */
var fs = require('fs-extra');
var path = require('path');

module.exports = function(root, target) {
		var root = process.cwd();
		var configPath = path.join(root, '/sugar-config.json');
		if (!fs.existsSync(configPath)) {
				console.log('当前不存在sugar-config.json，请确定当前目录为开发根目录');
				return;
		}

		var config = target ? getConf(target) : false;

		var serverPath = config ? config['path'] 
						: require(path.join(process.env['HOME'], '/.sugar.json'))['server'];

		var appSrc = path.join(root, '/app');
		var target = path.join(serverPath, '/app');
		fs.copy(appSrc, target, function(err) {
				if (err) {
						console.log('复制 ' + appSrc + ' 失败: ' + err);
						return;
				}
				console.log('复制 ' + appSrc + ' 成功');
		});

		var viewSrc = path.join(root, '/views');
		var target = path.join(serverPath, '/views');
		fs.copy(viewSrc, target, function(err) {
				if (err) {
						console.log('复制 ' + viewSrc + ' 失败: ' + err);
						return;
				}
				console.log('复制 ' + viewSrc + ' 成功');
		});

		var staticSrc = path.join(root, '/static');
		var target = path.join(serverPath, '/static');
		fs.copy(staticSrc, target, function(err) {
				if (err) {
						console.log('复制 ' + staticSrc + ' 失败: ' + err);
						return;
				}
				console.log('复制 ' + staticSrc + ' 成功');
		});
};

function getConf(key) {
		var root = process.cwd();
		var confPath = path.join(root, '/sugar-config.json');
		if (!fs.existsSync(confPath)) return false;
		
		var config = require(confPath);
		return config['target'] && config['target'][key];
}
