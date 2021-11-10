'use strict';

const any = require('r-assign/lib/any');
const array = require('r-assign/lib/array');
const bigint = require('r-assign/lib/bigint');
const boolean = require('r-assign/lib/boolean');
const f = require('r-assign/lib/function');
const get = require('r-assign/lib/get-type');
const instance = require('r-assign/lib/instance');
const intersection = require('r-assign/lib/intersection');
const literal = require('r-assign/lib/literal');
const n = require('r-assign/lib/null');
const number = require('r-assign/lib/number');
const object = require('r-assign/lib/object');
const optional = require('r-assign/lib/optional');
const parse = require('r-assign/lib/parse-type');
const string = require('r-assign/lib/string');
const symbol = require('r-assign/lib/symbol');
const tuple = require('r-assign/lib/tuple');
const u = require('r-assign/lib/undefined');
const union = require('r-assign/lib/union');

module.exports = {
	...any,
	...array,
	...bigint,
	...boolean,
	...f,
	...get,
	...instance,
	...intersection,
	...literal,
	...n,
	...number,
	...object,
	...optional,
	...parse,
	...string,
	...symbol,
	...tuple,
	...u,
	...union
};