'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getString, isString } = require('r-assign/lib/string');
const {
	getOptional,
	isOptional,
	parseOptional
} = require('r-assign/lib/optional');

test('getOptional', ({ end }) => {

	const getOptionalString = getOptional(getString());

	equal(typeof getOptionalString(), 'undefined');
	equal(getOptionalString(''), '');
	equal(getOptionalString('data'), 'data');
	equal(getOptionalString(null), '');

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

	equal(typeof parseOptionalString(), 'undefined');
	equal(parseOptionalString(''), '');

	throws(() => {
		parseOptionalString(null);
	});

	end();
});