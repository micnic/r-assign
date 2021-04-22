'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getString, isString, parseString } = require('r-assign/lib/string');

test('getString', ({ end }) => {

	const getStringNoDefault = getString();

	equal(getStringNoDefault(), '');
	equal(getStringNoDefault('data'), 'data');
	equal(getStringNoDefault(null), '');

	const getStringData = getString('data');

	equal(getStringData(), 'data');
	equal(getStringData('data'), 'data');
	equal(getStringData(null), 'data');

	throws(() => {
		getString(null);
	});

	end();
});

test('isString', ({ end }) => {
	notOk(isString());
	ok(isString(''));
	end();
});

test('parseString', ({ end }) => {
	equal(parseString(''), '');
	throws(() => {
		parseString();
	});
	end();
});