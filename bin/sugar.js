#!/usr/bin/env node
var program = require('commander');

// setting version
program.version(require('../package').version);
program.usage('<command> [options]');

// seeting init
program
		.command('init <name>')
		.description('init server or app')
		.option('-t, --target <target>')
		.action(require('../libs/commands/init'));

// seeting server
program
		.command('server <action>')
		.description('control server start, stop, restart, and lookup')
		.action(require('../libs/commands/server'));

// seeting init
program
		.command('release')
		.description('release app to server')
		.option('-t, --target <target>')
		.option('-w, --watch')
		.action(require('../libs/commands/release'));

program.parse(process.argv);


if (program.args.length <= 0) program.help();
