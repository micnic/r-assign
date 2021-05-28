'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getString, isString, parseString } = require('r-assign/lib/string');

const expected = 'expected a string value but received';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;

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
	}, TypeError(`${invalidDefaultValue}, ${expected} null`));

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
		parseString(null);
	}, TypeError(`${invalidValue}, ${expected} null`));

	throws(() => {
		parseString(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expected} null`));

	end();
});