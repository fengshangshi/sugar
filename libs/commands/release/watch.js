/**
 * @file 自动监听文件变化
 * @author fengshangshi
 */
var fs = require('fs-extra');
var chokidar = require('chokidar');
var path = require('path');
var cp = require('child_process');
var readline = require('readline');

var release = require('./release');

var serverPath, root;

module.exports = function(src, target) {
	root = src;
	release(root, target);
	restartServer();

	var config = target ? getConf(target) : false;
	serverPath = config ? config['path'] : require(path.join(process.env['HOME'],
		'/.sugar.json'))['server'];

	chokidar.watch(root, {
		ignored: /[\/\\]\./
	}).on('change', chokidarHandle);
};

function chokidarHandle(src) {
	copyFile(src, function(err) {
		if (err) return console.log(src + ' 发布失败: ' + err);
		console.log(src + ' 发布成功');

		restartServer();
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

function restartServer() {
	var spawn = cp.spawn('sugar', ['server', 'restart'], {
		env: process.env
	});

	var stdoutR = readline.createInterface({
		input: spawn.stdout,
		terminal: false
	});

	stdoutR.on('line', function(line) {
		console.log(line);
	});

	var stderrR = readline.createInterface({
		input: spawn.stderr,
		terminal: false
	});

	stderrR.on('line', function(line) {
		console.log(line);
	});
}
