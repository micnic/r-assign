'use strict';

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
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const received = 'but received null';

test('getArrayOf', ({ end }) => {

	const getArrayOfString = getArrayOf(isString);

	match(getArrayOfString(), []);
	match(getArrayOfString(null), []);
	match(getArrayOfString([]), []);
	match(getArrayOfString(['']), ['']);

	throws(() => {
		getArrayOf();
	}, TypeError('Invalid type guard provided'));

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
	}, TypeError('Invalid type guard provided'));

	end();
});

test('parseArrayOf', ({ end }) => {

	const parseArrayOfStrings = parseArrayOf(isString);

	match(parseArrayOfStrings(['']), ['']);

	throws(() => {
		parseArrayOfStrings(null);
	}, TypeError(`${invalidValue}, ${expectedSingle} ${received}`));

	throws(() => {
		parseArrayOfStrings(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expectedSingle} ${received}`));

	end();
});