'use strict';

const any = require('r-assign/lib/any');
const array = require('r-assign/lib/array');
const assert = require('r-assign/lib/assert-type');
const bigint = require('r-assign/lib/bigint');
const boolean = require('r-assign/lib/boolean');
const date = require('r-assign/lib/date');
const func = require('r-assign/lib/function');
const get = require('r-assign/lib/get-type');
const instance = require('r-assign/lib/instance');
const intersection = require('r-assign/lib/intersection');
const literal = require('r-assign/lib/literal');
const never = require('r-assign/lib/never');
const nulled = require('r-assign/lib/null');
const number = require('r-assign/lib/number');
const object = require('r-assign/lib/object');
const optional = require('r-assign/lib/optional');
const parse = require('r-assign/lib/parse-type');
const partial = require('r-assign/lib/partial');
const promise = require('r-assign/lib/promise');
const record = require('r-assign/lib/record');
const required = require('r-assign/lib/required');
const same = require('r-assign/lib/same');
const string = require('r-assign/lib/string');
const symbol = require('r-assign/lib/symbol');
const template = require('r-assign/lib/template-literal');
const tuple = require('r-assign/lib/tuple');
const undef = require('r-assign/lib/undefined');
const union = require('r-assign/lib/union');

module.exports = {
	...any,
	...array,
	...assert,
	...bigint,
	...boolean,
	...date,
	...func,
	...get,
	...instance,
	...intersection,
	...literal,
	...never,
	...nulled,
	...number,
	...object,
	...optional,
	...parse,
	...partial,
	...promise,
	...record,
	...required,
	...same,
	...string,
	...symbol,
	...template,
	...tuple,
	...undef,
	...union
};