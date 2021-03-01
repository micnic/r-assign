'use strict';

const any = require('r-assign/lib/any');
const array = require('r-assign/lib/array');
const bigint = require('r-assign/lib/bigint');
const boolean = require('r-assign/lib/boolean');
const literal = require('r-assign/lib/literal');
const number = require('r-assign/lib/number');
const object = require('r-assign/lib/object');
const string = require('r-assign/lib/string');
const symbol = require('r-assign/lib/symbol');
const type = require('r-assign/lib/type');

module.exports = {
	...any,
	...array,
	...bigint,
	...boolean,
	...literal,
	...number,
	...object,
	...string,
	...symbol,
	...type
};