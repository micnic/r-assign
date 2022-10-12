'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	func,
	isFunction,
	isOptional,
	isString,
	isTupleRestOf
} = require('r-assign/lib');

test('isFunction', ({ end }) => {

	equal(isFunction, func);

	ok(isFunction([])(() => null));
	ok(isFunction([isString])(() => null));
	ok(isFunction([isOptional(isString)])(() => null));
	ok(isFunction([isTupleRestOf(isString)])(() => null));
	ok(isFunction([isTupleRestOf(isString), isString])(() => null));
	ok(isFunction([], isString)(() => null));
	notOk(isFunction([])(null));

	throws(() => {
		// @ts-expect-error
		ok(isFunction([], isOptional(isString))(() => null));
	}, TypeError('Invalid use of optional type'));

	end();
});