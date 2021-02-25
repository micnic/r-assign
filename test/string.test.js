'use strict';

const { test } = require('tap');
const { isString, useString, validateString } = require('r-assign/lib/string');

test('isString', ({ end, notOk, ok }) => {
	notOk(isString());
	ok(isString(''));
	end();
});

test('useString', ({ end, equals, throws }) => {

	const getString = useString();

	equals(getString(), '');
	equals(getString('data'), 'data');
	equals(getString(null), '');

	const getStringData = useString('data');

	equals(getStringData(), 'data');
	equals(getStringData('data'), 'data');
	equals(getStringData(null), 'data');

	throws(() => {
		useString(null);
	});

	end();
});

test('validateString', ({ end, equals, throws }) => {
	equals(validateString(''), '');
	throws(() => {
		validateString();
	});
	end();
});