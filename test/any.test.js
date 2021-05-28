'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const { getAny, isAny, parseAny } = require('r-assign/lib/any');

const expected = 'expected a non-undefined value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;

test('getAny', ({ end }) => {

	const getAnyNull = getAny(null);

	equal(getAnyNull(), null);
	equal(getAnyNull(null), null);

	throws(() => {
		getAny();
	}, TypeError(`${invalidDefaultValue}, ${expected}`));

	end();
});

test('isAny', ({ end }) => {
	notOk(isAny());
	ok(isAny(null));

	end();
});

test('parseAny', ({ end }) => {
	equal(parseAny(null), null);

	throws(() => {
		parseAny();
	}, TypeError(`${invalidValue}, ${expected}`));

	throws(() => {
		parseAny([][0], 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expected}`));

	end();
});