/**
 * @file sugar index
 * @author fengshangshi
 */
var _ = require('lodash');

module.exports = Sugar;

function Sugar(req) {
		var GET = this.GET = req.query;
		var POST = this.POST = req.body;
		var PARAM = this.PARAM = req.params;
		var REQUEST = this.REQUEST = {};

		// 整合request对象
		// 优先级 params > get > post
		_.defaults(REQUEST, PARAM);
		_.defaults(REQUEST, GET);
		_.defaults(REQUEST, POST);
}
