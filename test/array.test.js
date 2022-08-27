'use strict';

const { test, equal, match, notOk, ok, throws } = require('tap');
const {
	array,
	getArrayOf,
	isArrayOf,
	parseArrayOf
} = require('r-assign/lib/array');
const { isBoolean } = require('r-assign/lib/boolean');
const { isOptional } = require('r-assign/lib/optional');
const { isString } = require('r-assign/lib/string');
const { isUnionOf } = require('r-assign/lib/union');

const expectedSingle = 'expected an array of strings';
const expectedUnion = 'expected an array of boolean | string';
const invalidDefaultValue = 'Invalid default value type';
const invalidOptionalType = 'Invalid use of optional type';
const invalidTypeGuard = 'Invalid type guard provided';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const received = 'but received null';
const receivedFunction = 'but received a value of type Function';
const receivedMixedArray = 'but received a value of type (string | number)[]';
const receivedNullArray = 'but received a value of type null[]';
const receivedObjectArray = 'but received a value of type Object[]';
const receivedStringArray = 'but received a value of type String[]';

test('getArrayOf', ({ end }) => {

	const getArrayOfString = getArrayOf(isString);

	match(getArrayOfString(), []);
	match(getArrayOfString(null), []);
	match(getArrayOfString([]), []);
	match(getArrayOfString(['']), ['']);

	throws(() => {
		// @ts-expect-error
		getArrayOf();
	}, TypeError(invalidTypeGuard));

	throws(() => {
		// @ts-expect-error
		getArrayOf(isString, null);
	}, TypeError(`${invalidDefaultValue}, ${expectedSingle} ${received}`));

	throws(() => {
		// @ts-expect-error
		getArrayOf(isUnionOf([isBoolean, isString]), null);
	}, TypeError(`${invalidDefaultValue}, ${expectedUnion} ${received}`));

	end();
});

test('isArrayOf', ({ end }) => {

	const sparseArrayLength = 3;
	const sparseArray = new Array(sparseArrayLength);

	sparseArray[1] = true;

	equal(isArrayOf, array);

	ok(isArrayOf(isBoolean)([]));
	ok(isArrayOf(isBoolean)([true]));
	notOk(isArrayOf(isBoolean)(sparseArray));
	notOk(isArrayOf(isBoolean)());

	throws(() => {
		// @ts-expect-error
		isArrayOf();
	}, TypeError(invalidTypeGuard));

	throws(() => {
		// @ts-expect-error
		isArrayOf(isOptional(isString));
	}, TypeError(invalidOptionalType));

	end();
});

test('parseArrayOf', ({ end }) => {

	const parseArrayOfStrings = parseArrayOf(isString);

	match(parseArrayOfStrings(['']), ['']);

	throws(() => {
		// @ts-expect-error
		parseArrayOf(null);
	}, TypeError(invalidTypeGuard));

	throws(() => {
		parseArrayOfStrings(null);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${received}`));

	throws(() => {
		parseArrayOfStrings(() => null);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${receivedFunction}`));

	throws(() => {
		parseArrayOfStrings([null]);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${receivedNullArray}`));

	throws(() => {
		// eslint-disable-next-line no-new-wrappers
		parseArrayOfStrings([new String]);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${receivedStringArray}`));

	throws(() => {
		parseArrayOfStrings([Object.create(null)]);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${receivedObjectArray}`));

	throws(() => {
		parseArrayOfStrings(['', 0]);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${receivedMixedArray}`));

	throws(() => {
		parseArrayOfStrings(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expectedSingle} ${received}`));

	end();
});