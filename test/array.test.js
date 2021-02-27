'use strict';

const { test } = require('tap');
const {
	isArrayOf,
	useArrayOf,
	useArrayOfValidation
} = require('r-assign/lib/array');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');

test('isArrayOf', ({ end, notOk, ok, throws }) => {

	ok(isArrayOf([isBoolean], []));
	ok(isArrayOf([isBoolean], [true]));
	ok(isArrayOf([isBoolean, isNumber], [true, 1]));
	notOk(isArrayOf([isNumber]));

	throws(() => {
		isArrayOf();
	});

	throws(() => {
		isArrayOf([null], null);
	});

	throws(() => {
		isArrayOf([() => null], null);
	});

	end();
});

test('useArrayOf', ({ end, matches, throws }) => {

	const getArrayOfString = useArrayOf([isString]);

	matches(getArrayOfString(), []);
	matches(getArrayOfString(null), []);
	matches(getArrayOfString([]), []);
	matches(getArrayOfString(['']), ['']);

	throws(() => {
		useArrayOf();
	});

	throws(() => {
		useArrayOf([null], null);
	});

	throws(() => {
		useArrayOf([() => null], null);
	});

	throws(() => {
		useArrayOf([isString], null);
	});

	end();
});

test('useArrayOfValidation', ({ end, matches, throws }) => {

	const validateArrayOfString = useArrayOfValidation(isString);

	matches(validateArrayOfString(['']), ['']);

	throws(() => {
		validateArrayOfString(null);
	});

	end();
});