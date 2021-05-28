'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { isAny } = require('r-assign/lib/any');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');
const {
	getUnionOf,
	isUnionOf,
	parseUnionOf
} = require('r-assign/lib/union');

const expected = 'expected an union of (string | number)';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';

test('getUnionOf', ({ end }) => {

	const getStringOrNumber = getUnionOf([isString, isNumber], '');

	equal(getStringOrNumber(), '');
	equal(getStringOrNumber(0), 0);
	equal(getStringOrNumber(1), 1);
	equal(getStringOrNumber(''), '');
	equal(getStringOrNumber('data'), 'data');

	throws(() => {
		getUnionOf([isString, isNumber], null);
	}, TypeError(`${invalidDefaultValue}, ${expected} but received null`));

	end();
});

test('isUnionOf', ({ end }) => {

	ok(isUnionOf([isAny, isString])());
	ok(isUnionOf([isBoolean, isNumber])(true));
	ok(isUnionOf([isBoolean, isNumber])(0));
	notOk(isUnionOf([isBoolean, isNumber])(''));

	throws(() => {
		isUnionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		isUnionOf([]);
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		isUnionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	end();
});

test('parseUnionOf', ({ end }) => {

	const parseStringOrNumber = parseUnionOf([isString, isNumber]);

	equal(parseStringOrNumber(''), '');

	throws(() => {
		parseStringOrNumber(null);
	}, TypeError(`${invalidValue}, ${expected} but received null`));

	end();
});