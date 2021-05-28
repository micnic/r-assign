'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getString, isString } = require('r-assign/lib/string');
const {
	getOptional,
	isOptional,
	parseOptional
} = require('r-assign/lib/optional');

const expected = 'expected an union of (string | undefined)';
const invalidValue = 'Invalid value type';
const received = 'but received null';

test('getOptional', ({ end }) => {

	const getOptionalString = getOptional(getString());

	equal(typeof getOptionalString(), 'undefined');
	equal(getOptionalString(''), '');
	equal(getOptionalString('data'), 'data');
	equal(getOptionalString(null), '');

	throws(() => {
		getOptional();
	}, TypeError('Invalid transform function provided'));

	end();
});

test('isOptional', ({ end }) => {

	const isOptionalString = isOptional(isString);

	ok(isOptionalString());
	ok(isOptionalString(''));
	notOk(isOptionalString(null));

	throws(() => {
		isOptional();
	}, TypeError('Invalid type guard provided'));

	end();
});

test('parseOptional', ({ end }) => {

	const parseOptionalString = parseOptional(isString);

	equal(typeof parseOptionalString(), 'undefined');
	equal(parseOptionalString(''), '');

	throws(() => {
		parseOptionalString(null);
	}, TypeError(`${invalidValue}, ${expected} ${received}`));

	end();
});