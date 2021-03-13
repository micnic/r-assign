'use strict';

const { test } = require('tap');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');
const {
	getUnionOf,
	isUnionOf,
	parseUnionOf
} = require('r-assign/lib/union');

test('getUnionOf', ({ end, equals, throws }) => {

	const getStringOrNumber = getUnionOf([isNumber, isString], '');

	equals(getStringOrNumber(), '');
	equals(getStringOrNumber(0), 0);
	equals(getStringOrNumber(1), 1);
	equals(getStringOrNumber(''), '');
	equals(getStringOrNumber('data'), 'data');

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
		getUnionOf([isString], null);
	});

	end();
});

test('isUnionOf', ({ end, notOk, ok, throws }) => {

	ok(isUnionOf([isBoolean], true));
	ok(isUnionOf([isBoolean, isNumber], true));
	notOk(isUnionOf([isNumber], true));

	throws(() => {
		isUnionOf();
	});

	throws(() => {
		isUnionOf([null], null);
	});

	throws(() => {
		isUnionOf([() => null], null);
	});

	end();
});

test('parseUnionOf', ({ end, equals, throws }) => {

	const parseString = parseUnionOf(isString);

	equals(parseString(''), '');

	throws(() => {
		parseString(null);
	});

	end();
});