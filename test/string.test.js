'use strict';

/* eslint-disable no-new-wrappers */

const { test, equal, notOk, ok, throws } = require('tap');
const { getString, isString, parseString } = require('r-assign/lib/string');

const expected = 'expected a string value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedString = 'but received an instance of String';

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
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

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
		parseString(new String);
	}, TypeError(`${invalidValue}, ${expected} ${receivedString}`));

	throws(() => {
		parseString(null);
	}, TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

	throws(() => {
		parseString(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`));

	end();
});