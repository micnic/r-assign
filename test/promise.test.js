'use strict';

const { test, equal, ok } = require('tap');
const {
	isPromiseOf,
	isString,
	promise
} = require('r-assign/lib');

test('isPromiseOf', ({ end }) => {

	equal(isPromiseOf, promise);

	ok(isPromiseOf()(Promise.resolve()));
	ok(isPromiseOf(isString)(Promise.resolve('abc')));

	end();
});