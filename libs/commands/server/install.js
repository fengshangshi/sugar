/**
 * @file 启动服务器
 * @author fengshangshi
 */
var cp = require('child_process');
var readline = require('readline');

module.exports = function(config) {
	var server = config['server'];

	console.log('开始安装服务器依赖...');
	var spawn = cp.spawn('npm', ['install'], {
		cwd: server,
		env: process.env
	});

	var stdoutR = readline.createInterface({
		input: spawn.stdout,
		terminal: false
	});

	stdoutR.on('line', function(line) {
		console.log(line);
	});

	spawn.stdout.on('end', function() {
		console.log('服务器依赖安装完成');
	});

	var stderrR = readline.createInterface({
		input: spawn.stderr,
		terminal: false
	});

	stderrR.on('line', function(line) {
		console.log(line);
	});
};
