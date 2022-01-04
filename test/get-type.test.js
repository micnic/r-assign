'use strict';

const { test, equal, match, throws } = require('tap');
const { getType } = require('r-assign/lib/get-type');
const { isArrayOf } = require('r-assign/lib/array');
const { isFunction } = require('r-assign/lib/function');
const { isNumber } = require('r-assign/lib/number');
const { isObjectOf } = require('r-assign/lib/object');
const { isOptional } = require('r-assign/lib/optional');
const { isString } = require('r-assign/lib/string');
const { isTupleOf } = require('r-assign/lib/tuple');
const { isUnionOf } = require('r-assign/lib/union');

const expected = 'expected a string value';
const invalidDefaultValue = 'Invalid default value type';
const receivedArray = 'but received a value of type string[]';

/**
 * Append dot to the provided string
 * @param {string} string
 * @returns {string}
 */
const appendDot = (string) => `${string}.`;

test('getType', ({ end }) => {

	const getString = getType(isString, '');

	equal(getString('abc'), 'abc');
	equal(getString(), '');

	const getStringWithDot = getType(isString, '', appendDot);

	equal(getStringWithDot('abc'), 'abc.');
	equal(getStringWithDot(), '.');

	const getStringTuple = getType(isTupleOf([isString]), ['']);

	match(getStringTuple(['abc']), ['abc']);
	match(getStringTuple(), ['']);

	const getStringArray = getType(isArrayOf(isString), []);

	match(getStringArray(['abc']), ['abc']);
	match(getStringArray(), []);

	const getStringOrNumber = getType(isUnionOf([isString, isNumber]), '');

	equal(getStringOrNumber('abc'), 'abc');
	equal(getStringOrNumber(0), 0);
	equal(getStringOrNumber(), '');

	const getObjectOfString = getType(isObjectOf({
		a: isOptional(isString)
	}), {});

	match(getObjectOfString({ a: 'abc' }), { a: 'abc' });
	match(getObjectOfString({ a: 0 }), {});
	match(getObjectOfString({}), {});
	match(getObjectOfString(), {});

	const getFunction = getType(isFunction([]), () => null);
	const someFunction = getFunction(() => null);

	throws(() => {
		// @ts-expect-error
		someFunction(null);
	}, TypeError('Invalid function arguments'));

	throws(() => {
		someFunction();
	}, TypeError('Invalid function return, expected void'));

	// @ts-expect-error
	const getOtherFunction = getType(isFunction([], isString), () => null);
	const someOtherFunction = getOtherFunction(() => '');
	const someOtherDefaultFunction = getOtherFunction();

	equal(someOtherFunction(), '');

	throws(() => {
		someOtherDefaultFunction();
	}, TypeError('Invalid function return'));

	throws(() => {
		// @ts-expect-error
		getType();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		getType(isString, ['a', 'b']);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedArray}`));

	throws(() => {
		// @ts-expect-error
		getType(isOptional(isString), '');
	}, TypeError('Optional type guard cannot be used as base'));

	throws(() => {
		// @ts-expect-error
		getType(isString);
	}, TypeError(`${invalidDefaultValue}, ${expected} but received undefined`));

	end();
});