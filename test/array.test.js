'use strict';

const { test, match, notOk, ok, throws } = require('tap');
const {
	getArrayOf,
	isArrayOf,
	parseArrayOf
} = require('r-assign/lib/array');
const { isBoolean } = require('r-assign/lib/boolean');
const { isString } = require('r-assign/lib/string');

test('getArrayOf', ({ end }) => {

	const getArrayOfString = getArrayOf(isString);

	match(getArrayOfString(), []);
	match(getArrayOfString(null), []);
	match(getArrayOfString([]), []);
	match(getArrayOfString(['']), ['']);

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

	const sparseArrayLength = 3;
	const sparseArray = new Array(sparseArrayLength);

	sparseArray[1] = true;

	ok(isArrayOf(isBoolean)([]));
	ok(isArrayOf(isBoolean)([true]));
	notOk(isArrayOf(isBoolean)(sparseArray));
	notOk(isArrayOf(isBoolean)());

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

	match(validateArrayOfString(['']), ['']);

	throws(() => {
		validateArrayOfString(null);
	});

	end();
});