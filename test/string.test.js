'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	asString,
	convertToString,
	getString,
	isString,
	parseString,
	string
} = require('r-assign/lib/string');

const expected = 'expected a string value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedString = 'but received an instance of String';

test('asString', ({ end }) => {

	equal(asString, convertToString);

	equal(asString(), 'undefined');
	equal(asString(null), 'null');
	equal(asString(''), '');

	end();
});

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
		// @ts-expect-error
		getString(null);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

	end();
});

test('isString', ({ end }) => {

	equal(isString, string);

	notOk(isString());
	ok(isString(''));
	end();
});

test('parseString', ({ end }) => {
	equal(parseString(''), '');

	throws(() => {
		// eslint-disable-next-line no-new-wrappers
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