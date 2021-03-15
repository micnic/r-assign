'use strict';

const { test } = require('tap');
const { getString } = require('r-assign/lib/string');
const {
	getOptional
} = require('r-assign/lib/optional');

test('getOptional', ({ end, equals, throws }) => {

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