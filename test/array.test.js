'use strict';

const { test, matches, notOk, ok, throws } = require('tap');
const {
	getArrayOf,
	isArrayOf,
	parseArrayOf
} = require('r-assign/lib/array');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');

test('getArrayOf', ({ end }) => {

	const getArrayOfString = getArrayOf(isString);

	matches(getArrayOfString(), []);
	matches(getArrayOfString(null), []);
	matches(getArrayOfString([]), []);
	matches(getArrayOfString(['']), ['']);

	throws(() => {
		getArrayOf();
	});

	throws(() => {
		getArrayOf(null, null);
	});

	throws(() => {
		getArrayOf(() => null, null);
	});

	throws(() => {
		getArrayOf(isString, null);
	});

	end();
});

test('isArrayOf', ({ end }) => {

	ok(isArrayOf(isBoolean)([]));
	ok(isArrayOf(isBoolean)([true]));
	notOk(isArrayOf(isNumber)());

	throws(() => {
		isArrayOf();
	});

	throws(() => {
		isArrayOf(null, null);
	});

	throws(() => {
		isArrayOf(() => null, null);
	});

	end();
});

test('parseArrayOf', ({ end }) => {

	const validateArrayOfString = parseArrayOf(isString);

	matches(validateArrayOfString(['']), ['']);

	throws(() => {
		validateArrayOfString(null);
	});

	end();
});