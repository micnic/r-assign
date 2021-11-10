'use strict';

const { test, notOk, ok, throws } = require('tap');

const { isFunction } = require('r-assign/lib/function');
const { isOptional } = require('r-assign/lib/optional');
const { isString } = require('r-assign/lib/string');

test('isFunction', ({ end }) => {

	ok(isFunction([])(() => null));
	ok(isFunction([isString])(() => null));
	ok(isFunction([isOptional(isString)])(() => null));
	ok(isFunction([], isString)(() => null));
	notOk(isFunction([])(null));

	throws(() => {
		ok(isFunction([], isOptional(isString))(() => null));
	}, TypeError('Optional type cannot be a function return'));

	end();
});