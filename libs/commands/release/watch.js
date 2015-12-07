/**
 * @file 自动监听文件变化
 * @author fengshangshi
 */
var fs = require('fs-extra');
var chokidar = require('chokidar');
var path = require('path');
var cp = require('child_process');
var release = require('./release');
var serverPath, root;

module.exports = function(src, target) {
		root = src;
		release(root, target);
		var config = target ? getConf(target) : false;
		serverPath = config ? config['path'] 
						: require(path.join(process.env['HOME'], '/.sugar.json'))['server'];

		chokidar.watch(root, {ignored: /[\/\\]\./}).on('change', chokidarHandle);
};

function chokidarHandle(src) {
		copyFile(src, function(err) {
				if (err) return console.log(src + ' 发布失败: ' + err);
				console.log(src + ' 发布成功');
				
				var spawn = cp.spawn('sugar', ['server', 'restart']);
				spawn.stdout.on('data', function(data) {console.log(data);});
				
		});
}

function copyFile(src, cb) {
		var target = path.join(serverPath, src.split(root)[1]);
		if (/app|views|static/.test(target)) {
				fs.copy(src, target, function(err) {
						if (cb) {
								cb.call(null, err);
						}
				});
		}
}
