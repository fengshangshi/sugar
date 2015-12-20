/**
 * @file 启动服务器
 * @author fengshangshi
 */
var cp = require('child_process');
var readline = require('readline');

module.exports = function(config) {
	var bin = config['bin'];

	var spawn = cp.spawn(bin, ['start'], {
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
};
