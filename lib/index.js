'use strict';

const any = require('r-assign/lib/any');
const array = require('r-assign/lib/array');
const bigint = require('r-assign/lib/bigint');
const boolean = require('r-assign/lib/boolean');
const number = require('r-assign/lib/number');
const symbol = require('r-assign/lib/symbol');
const string = require('r-assign/lib/string');
const type = require('r-assign/lib/type');

module.exports = {
	...any,
	...array,
	...bigint,
	...boolean,
	...number,
	...string,
	...symbol,
	...type
};