'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getString, isString } = require('r-assign/lib/string');
const {
	getOptional,
	isOptional,
	isOptionalUndefined,
	optional,
	optionalUndef,
	parseOptional
} = require('r-assign/lib/optional');

const expected = 'expected an optional value of string';
const invalidValue = 'Invalid value type';
const received = 'but received null';

test('getOptional', ({ end }) => {

	const getOptionalString = getOptional(getString());

	equal(getOptionalString(), undefined);
	equal(getOptionalString(''), '');
	equal(getOptionalString('data'), 'data');
	equal(getOptionalString(null), '');

	throws(() => {
		// @ts-expect-error
		getOptional();
	}, TypeError('Invalid transform function provided'));

	end();
});

test('isOptional', ({ end }) => {

	const isOptionalString = isOptional(isString);

	equal(isOptional, optional);

	ok(isOptionalString());
	ok(isOptionalString(''));
	notOk(isOptionalString(null));

	throws(() => {
		// @ts-expect-error
		isOptional();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isOptional(isOptional(isString));
	}, TypeError('Optional type cannot be wrapped in optional type'));

	end();
});

test('isOptionalUndefined', ({ end }) => {

	const isOptionalString = isOptionalUndefined(isString);

	equal(isOptionalUndefined, optionalUndef);

	ok(isOptionalString());
	ok(isOptionalString(''));
	notOk(isOptionalString(null));

	throws(() => {
		// @ts-expect-error
		isOptionalUndefined();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isOptionalUndefined(isOptionalUndefined(isString));
	}, TypeError('Optional type cannot be wrapped in optional type'));

	end();
});

test('parseOptional', ({ end }) => {

	const parseOptionalString = parseOptional(isString);

	equal(parseOptionalString(), undefined);
	equal(parseOptionalString(''), '');

	throws(() => {
		parseOptionalString(null);
	}, TypeError(`${invalidValue}, ${expected} ${received}`));

	end();
});