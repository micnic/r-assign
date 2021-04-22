'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');
const {
	getUnionOf,
	isUnionOf,
	parseUnionOf
} = require('r-assign/lib/union');

test('getUnionOf', ({ end }) => {

	const getStringOrNumber = getUnionOf([isNumber, isString], '');

	equal(getStringOrNumber(), '');
	equal(getStringOrNumber(0), 0);
	equal(getStringOrNumber(1), 1);
	equal(getStringOrNumber(''), '');
	equal(getStringOrNumber('data'), 'data');

	throws(() => {
		getUnionOf();
	});

	throws(() => {
		getUnionOf([null], null);
	});

	throws(() => {
		getUnionOf([() => null], null);
	});

	throws(() => {
		getUnionOf([isNumber, isString], null);
	});

	end();
});

test('isUnionOf', ({ end }) => {

	ok(isUnionOf([isBoolean, isNumber])(true));
	ok(isUnionOf([isBoolean, isNumber])(0));
	notOk(isUnionOf([isBoolean, isNumber])(''));

	throws(() => {
		isUnionOf();
	});

	throws(() => {
		isUnionOf([]);
	});

	throws(() => {
		isUnionOf([null]);
	});

	throws(() => {
		isUnionOf([null, null]);
	});

	throws(() => {
		isUnionOf([() => null, () => null]);
	});

	end();
});

test('parseUnionOf', ({ end }) => {

	const parseStringOrNumber = parseUnionOf([isString, isNumber]);

	equal(parseStringOrNumber(''), '');

	throws(() => {
		parseStringOrNumber(null);
	});

	end();
});