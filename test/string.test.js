'use strict';

const { test } = require('tap');
const { getString, isString, parseString } = require('r-assign/lib/string');

test('getString', ({ end, equals, throws }) => {

	const getStringNoDefault = getString();

	equals(getStringNoDefault(), '');
	equals(getStringNoDefault('data'), 'data');
	equals(getStringNoDefault(null), '');

	const getStringData = getString('data');

	equals(getStringData(), 'data');
	equals(getStringData('data'), 'data');
	equals(getStringData(null), 'data');

	throws(() => {
		getString(null);
	});

	end();
});

test('isString', ({ end, notOk, ok }) => {
	notOk(isString());
	ok(isString(''));
	end();
});

test('parseString', ({ end, equals, throws }) => {
	equals(parseString(''), '');
	throws(() => {
		parseString();
	});
	end();
});