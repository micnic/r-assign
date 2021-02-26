'use strict';

const any = require('r-assign/lib/any');
const bigint = require('r-assign/lib/bigint');
const boolean = require('r-assign/lib/boolean');
const number = require('r-assign/lib/number');
const string = require('r-assign/lib/string');
const symbol = require('r-assign/lib/symbol');
const type = require('r-assign/lib/type');

module.exports = {
	...any,
	...bigint,
	...boolean,
	...number,
	...string,
	...symbol,
	...type
};