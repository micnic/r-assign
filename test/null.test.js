'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getString, isString } = require('r-assign/lib/string');
const {
	getNull,
	getNullable,
	isNull,
	isNullable,
	parseNull,
	parseNullable
} = require('r-assign/lib/null');

const expectedNull = 'expected a null value';
const expectedNullable = 'expected an union of (string | null)';
const invalidValue = 'Invalid value type';
const received = 'but received undefined';

test('getNull', ({ end }) => {

	equal(getNull()(), null);

	end();
});

test('getNullable', ({ end }) => {

	const getNullableString = getNullable(getString());

	equal(getNullableString(), '');
	equal(getNullableString(''), '');
	equal(getNullableString('data'), 'data');
	equal(getNullableString(null), null);

	throws(() => {
		getNullable();
	}, TypeError('Invalid transform function provided'));

	end();
});

test('isNull', ({ end }) => {

	ok(isNull(null));
	notOk(isNull());

	end();
});

test('isNullable', ({ end }) => {

	const isNullableString = isNullable(isString);

	ok(isNullableString(null));
	ok(isNullableString(''));
	notOk(isNullableString());

	throws(() => {
		isNullable();
	}, TypeError('Invalid type guard provided'));

	end();
});

test('parseNull', ({ end }) => {

	equal(parseNull(null), null);

	throws(() => {
		parseNull();
	}, TypeError(`${invalidValue}, ${expectedNull} ${received}`));

	end();
});

test('parseNullable', ({ end }) => {

	const parseNullableString = parseNullable(isString);

	equal(parseNullableString(null), null);
	equal(parseNullableString(''), '');

	throws(() => {
		parseNullableString();
	}, TypeError(`${invalidValue}, ${expectedNullable} ${received}`));

	end();
});