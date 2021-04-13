'use strict';

const { test, equals, notOk, ok, throws } = require('tap');
const { getString, isString } = require('r-assign/lib/string');
const {
	getOptional,
	isOptional,
	parseOptional
} = require('r-assign/lib/optional');

test('getOptional', ({ end }) => {

	const getOptionalString = getOptional(getString());

	equals(typeof getOptionalString(), 'undefined');
	equals(getOptionalString(''), '');
	equals(getOptionalString('data'), 'data');
	equals(getOptionalString(null), '');

	throws(() => {
		getOptional();
	});

	end();
});

test('isOptional', ({ end }) => {

	const isOptionalString = isOptional(isString);

	ok(isOptionalString());
	ok(isOptionalString(''));
	notOk(isOptionalString(null));

	throws(() => {
		isOptional();
	});

	throws(() => {
		isOptional(() => null);
	});

	end();
});

test('parseOptional', ({ end }) => {

	const parseOptionalString = parseOptional(isString);

	equals(typeof parseOptionalString(), 'undefined');
	equals(parseOptionalString(''), '');

	throws(() => {
		parseOptionalString(null);
	});

	end();
});