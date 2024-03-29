'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	boolean,
	getBoolean,
	isBoolean,
	parseBoolean
} = require('r-assign/lib/boolean');

const expected = 'expected a boolean value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedBoolean = 'but received an instance of Boolean';
const receivedNull = 'but received null';

test('getBoolean', ({ end }) => {

	const getBooleanNoDefault = getBoolean();

	equal(getBooleanNoDefault(), false);
	equal(getBooleanNoDefault(false), false);
	equal(getBooleanNoDefault(true), true);
	equal(getBooleanNoDefault(null), false);

	const getBooleanTrue = getBoolean(true);

	equal(getBooleanTrue(), true);
	equal(getBooleanTrue(false), false);
	equal(getBooleanTrue(true), true);
	equal(getBooleanTrue(null), true);

	throws(() => {
		// @ts-expect-error
		getBoolean(null);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

	end();
});

test('isBoolean', ({ end }) => {
	equal(isBoolean, boolean);

	notOk(isBoolean());
	ok(isBoolean(false));
	ok(isBoolean(true));
	end();
});

test('parseBoolean', ({ end }) => {
	equal(parseBoolean(false), false);

	throws(() => {
		// eslint-disable-next-line no-new-wrappers
		parseBoolean(new Boolean);
	}, TypeError(`${invalidValue}, ${expected} ${receivedBoolean}`));

	throws(() => {
		parseBoolean(null);
	}, TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

	throws(() => {
		parseBoolean(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`));

	end();
});