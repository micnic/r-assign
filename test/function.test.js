'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	asyncFunc,
	func,
	isAsyncFunction,
	isFunction,
	isOptional,
	isString,
	isTupleRestOf
} = require('r-assign/lib');

const simpleFunction = () => null;

test('isAsyncFunction', ({ end }) => {

	equal(isAsyncFunction, asyncFunc);

	ok(isAsyncFunction([])(simpleFunction));
	ok(isAsyncFunction([isString])(simpleFunction));
	ok(isAsyncFunction([isOptional(isString)])(simpleFunction));
	ok(isAsyncFunction([isTupleRestOf(isString)])(simpleFunction));
	ok(isAsyncFunction([isTupleRestOf(isString), isString])(simpleFunction));
	ok(isAsyncFunction([], isString)(simpleFunction));
	notOk(isAsyncFunction([])(null));

	throws(() => {
		// @ts-expect-error
		ok(isAsyncFunction([], isOptional(isString)));
	}, TypeError('Invalid use of optional type'));

	end();
});

test('isFunction', ({ end }) => {

	equal(isFunction, func);

	ok(isFunction([])(simpleFunction));
	ok(isFunction([isString])(simpleFunction));
	ok(isFunction([isOptional(isString)])(simpleFunction));
	ok(isFunction([isTupleRestOf(isString)])(simpleFunction));
	ok(isFunction([isTupleRestOf(isString), isString])(simpleFunction));
	ok(isFunction([], isString)(simpleFunction));
	notOk(isFunction([])(null));

	throws(() => {
		// @ts-expect-error
		ok(isFunction([], isOptional(isString)));
	}, TypeError('Invalid use of optional type'));

	end();
});