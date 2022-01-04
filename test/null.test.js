'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { isOptional } = require('r-assign/lib/optional');
const { getString, isString } = require('r-assign/lib/string');
const {
	getNull,
	getNullable,
	isNull,
	isNullable,
	isNullish,
	nullable,
	nulled,
	nullish,
	parseNull,
	parseNullable
} = require('r-assign/lib/null');

const expectedNull = 'expected a null value';
const expectedNullable = 'expected an union of (string | null)';
const invalidValue = 'Invalid value type';
const received = 'but received undefined';

test('getNull', ({ end }) => {

	equal(getNull(), null);

	end();
});

test('getNullable', ({ end }) => {

	const getNullableString = getNullable(getString());

	equal(getNullableString(), '');
	equal(getNullableString(''), '');
	equal(getNullableString('data'), 'data');
	equal(getNullableString(null), null);

	throws(() => {
		// @ts-expect-error
		getNullable();
	}, TypeError('Invalid transform function provided'));

	end();
});

test('isNull', ({ end }) => {

	equal(isNull, nulled);

	ok(isNull(null));
	notOk(isNull());

	end();
});

test('isNullable', ({ end }) => {

	const isNullableString = isNullable(isString);

	equal(isNullable, nullable);

	ok(isNullableString(null));
	ok(isNullableString(''));
	notOk(isNullableString());

	throws(() => {
		// @ts-expect-error
		isNullable();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isNullable(isOptional(isString));
	}, TypeError('Optional type cannot be nullable'));

	end();
});

test('isNullish', ({ end }) => {

	const isNullishString = isNullish(isString);

	equal(isNullish, nullish);

	ok(isNullishString(null));
	ok(isNullishString());
	ok(isNullishString(''));
	notOk(isNullishString(true));

	throws(() => {
		// @ts-expect-error
		isNullish();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isNullish(isOptional(isString));
	}, TypeError('Optional type cannot be nullish'));

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