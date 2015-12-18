/**
 * @file 服务器命令
 * @author fengshangshi
 */
var fs = require('fs');
var path = require('path');

module.exports = function(action) {
		var configPath = path.join(process.env['HOME'], '.sugar.json');
		if (!fs.existsSync(configPath)) {
				console.log('没有找到sugar.json，请确认是否已经安装了服务器');
				return;
		}

		var config = require(configPath);

		switch (action) {
				case 'start':
						require('./server/start')(config);
						break;

				case 'stop':
						require('./server/stop')(config);
						break;

				case 'restart':
						require('./server/restart')(config);
						break;

				case 'where':
						require('./server/where')(config);
						break;

				case 'install':
						require('./server/install')(config);
						break;

				default:
						console.log('just server start|stop|restart, and where');
						break;
		}
};

