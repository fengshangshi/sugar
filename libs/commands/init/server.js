/**
 * @file 初始化server环境
 * @author fengshangshi
 */
var fs = require('fs-extra');
var path = require('path');
var readline = require('readline');
var Scaffold = require('sugar-template-scaffold');

var conf = require('../../../config/scaffold');
var sugarConf = require('../../../config/sugar');

var suffixMap = {
	'gitlab': '.git',
	'github': '-master'
};

module.exports = function(root, source) {
	var target = root || path.join(process.env['HOME'], '.sugar');
	var type = source || 'gitlab';
	var config = conf.server[type];
	var id = config['repos'];


	var template = id.split('/')[1];

	if (!path.isAbsolute(target)) {
		console.log('必须指定绝对路径');
		return;
	}

	/*
	if (fs.existsSync(target)) {
			console.log('服务器已经存在，可以通过-t指定服务器安装目录');
			return;
	}
	*/

	// .sugar.json
	var sugarConfigPath = path.join(process.env['HOME'], '.sugar.json');
	if (!fs.existsSync(sugarConfigPath)) {
		fs.writeFileSync(sugarConfigPath, JSON.stringify(sugarConf, null, 2));
	}

	console.log('服务器初始化开始');
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

			var suffix = suffixMap[type] || '.git';

			src += ('/' + template + suffix);
			fs.copy(src, target, function(err) {
				if (err) {
					console.log('复制文件失败: ' + err);
					return;
				}

				console.log('文件复制完成');

				var sugarConfig = require(sugarConfigPath);

				sugarConfig['server'] = target;
				sugarConfig['bin'] = path.join(target, '/bin/www');

				sugarConfig['history'].splice(sugarConfig['history'].indexOf(target), 1);
				sugarConfig['history'].unshift(target);

				fs.writeFileSync(sugarConfigPath, JSON.stringify(sugarConfig, null, 2));

				// chmod 755
				var bin = sugarConfig['bin'];
				fs.chmodSync(bin, '755');

				// 创建logs
				var logs = path.join(sugarConfig['server'], 'logs');
				fs.existsSync(logs) || fs.mkdirSync(logs, '755');

				// 创建cache
				var cache = path.join(sugarConfig['server'], 'cache');
				fs.existsSync(cache) || fs.mkdirSync(cache, '755');

				var spawn = require('child_process').spawn;

				console.log('开始安装服务器必要的依赖');

				var registry = "--registry=https://registry.npm.taobao.org";
				var disturl = "--disturl=https://npm.taobao.org/dist";

				var s = spawn('npm', ['install', registry, disturl], {
					cwd: target,
					env: process.env
				});

				var stdoutR = readline.createInterface({
					input: s.stdout,
					terminal: false
				});

				stdoutR.on('line', function(line) {
					console.log(line);
				});

				s.stdout.on('end', function() {
					console.log('依赖安装完成');
					console.log('服务器环境初始化完成');
				});

				var stderrR = readline.createInterface({
					input: s.stderr,
					terminal: false
				});

				stderrR.on('line', function(line) {
					console.log(line);
				});
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
