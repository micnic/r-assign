'use strict';

const { test, throws } = require('tap');
const { assertType, isOptional, isString } = require('r-assign/lib');

const invalidValue = 'Invalid value type';
const expected = 'expected a string value';
const received = 'but received a value of type number';

test('assertType', ({ end }) => {

	assertType(isString, '');

	throws(() => {
		assertType(isString, 0);
	}, TypeError(`${invalidValue}, ${expected} ${received}`));

	throws(() => {
		assertType(isString, 0, 'Custom error message');
	}, TypeError('Custom error message'));

	throws(() => {
		// @ts-expect-error
		assertType(isOptional(isString), '');
	}, TypeError('Optional type guard cannot be used as base'));

	end();
});