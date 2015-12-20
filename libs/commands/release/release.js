/**
 * @file 发布代码
 * @author fengshangshi
 */
var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

var releaseConfig = require('../../../config/release');

module.exports = function(root, target) {
	var pwd = process.cwd();
	var sugarConfigPath = path.join(pwd, 'sugar-config.json');
	if (!fs.existsSync(sugarConfigPath)) {
		return console.log('当前不存在sugar-config.json，请确定当前目录为开发根目录');
	}

	var config = target ? getConf(target) : false;

	var serPath = config ? config['path'] : require(path.join(process.env[
		'HOME'], '.sugar.json'))['server'];

	// 复制文件
	_.forEach(releaseConfig.files, function(i) {
		var src = path.join(pwd, i);
		var target = path.join(serPath, i);
		copy(src, target);
	});
};

function copy(src, target) {
	fs.existsSync(src) && fs.copy(src, target, function(err) {
		if (err) {
			return console.log('复制 ' + src + ' 失败, error: ' + err);
		}
		console.log('复制 ' + src + ' 成功');
	});
}

function getConf(key) {
	var pwd = process.cwd();
	var sugarConfigPath = path.join(pwd, 'sugar-config.json');
	if (!fs.existsSync(sugarConfigPath)) return false;

	var config = require(sugarConfigPath);
	return config['target'] && config['target'][key];
}
