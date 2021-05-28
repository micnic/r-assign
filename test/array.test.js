'use strict';

/* eslint-disable no-empty-function, no-new-wrappers */

const { test, match, notOk, ok, throws } = require('tap');
const {
	getArrayOf,
	isArrayOf,
	parseArrayOf
} = require('r-assign/lib/array');
const { isBoolean } = require('r-assign/lib/boolean');
const { isString } = require('r-assign/lib/string');
const { isUnionOf } = require('r-assign/lib/union');


const expectedSingle = 'expected an array of strings';
const expectedUnion = 'expected an array of (boolean | string)';
const invalidDefaultValue = 'Invalid default value type';
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
		getArrayOf();
	}, TypeError(invalidTypeGuard));

	throws(() => {
		getArrayOf(isString, null);
	}, TypeError(`${invalidDefaultValue}, ${expectedSingle} ${received}`));

	throws(() => {
		getArrayOf(isUnionOf([isBoolean, isString]), null);
	}, TypeError(`${invalidDefaultValue}, ${expectedUnion} ${received}`));

	end();
});

test('isArrayOf', ({ end }) => {

	const sparseArrayLength = 3;
	const sparseArray = new Array(sparseArrayLength);

	sparseArray[1] = true;

	ok(isArrayOf(isBoolean)([]));
	ok(isArrayOf(isBoolean)([true]));
	notOk(isArrayOf(isBoolean)(sparseArray));
	notOk(isArrayOf(isBoolean)());

	throws(() => {
		isArrayOf();
	}, TypeError(invalidTypeGuard));

	end();
});

test('parseArrayOf', ({ end }) => {

	const parseArrayOfStrings = parseArrayOf(isString);

	match(parseArrayOfStrings(['']), ['']);

	throws(() => {
		parseArrayOf(null);
	}, TypeError(invalidTypeGuard));

	throws(() => {
		parseArrayOfStrings(null);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${received}`));

	throws(() => {
		parseArrayOfStrings(() => {});
	}, TypeError(`${invalidValue}, ${expectedSingle} ${receivedFunction}`));

	throws(() => {
		parseArrayOfStrings([null]);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${receivedNullArray}`));

	throws(() => {
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