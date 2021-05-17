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
	});

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
	});

	throws(() => {
		isNullable(() => null);
	});

	end();
});

test('parseNull', ({ end }) => {

	equal(parseNull(null), null);

	throws(() => {
		parseNull();
	});

	end();
});

test('parseNullable', ({ end }) => {

	const parseNullableString = parseNullable(isString);

	equal(parseNullableString(null), null);
	equal(parseNullableString(''), '');

	throws(() => {
		parseNullableString();
	});

	end();
});