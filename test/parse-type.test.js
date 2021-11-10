'use strict';

const { test, equal, throws } = require('tap');
const { parseType } = require('r-assign/lib/parse-type');
const { isOptional } = require('r-assign/lib/optional');
const { isString } = require('r-assign/lib/string');

const emptyArray = 'an empty array []';
const expected = 'expected a string value';
const invalidValue = 'Invalid value type';
const nestedArray = 'a value of type [][]';

test('parseType', ({ end }) => {

	const parseString = parseType(isString);

	equal(parseString('abc'), 'abc');

	throws(() => {
		parseString();
	}, TypeError(`${invalidValue}, ${expected} but received undefined`));

	throws(() => {
		parseString([]);
	}, TypeError(`${invalidValue}, ${expected} but received ${emptyArray}`));

	throws(() => {
		parseString([[]]);
	}, TypeError(`${invalidValue}, ${expected} but received ${nestedArray}`));

	throws(() => {
		parseType();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		parseType(isOptional(isString));
	}, TypeError('Optional type guard cannot be used as base'));

	end();
});