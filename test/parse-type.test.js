'use strict';

const { test, equal, throws } = require('tap');
const {
	isOptional,
	isString,
	isTemplateLiteralOf,
	parseType
} = require('r-assign/lib');

const emptyArray = 'an empty array []';
const expected = 'expected a string value';
// eslint-disable-next-line no-template-curly-in-string
const expectedTemplateLiteral = 'expected a template literal of `a-${string}`';
const invalidValue = 'Invalid value type';
const nestedArray = 'a value of type [][]';
const receivedUndefined = 'but received undefined';

/**
 * Append dot to the provided string
 * @param {string} string
 * @returns {string}
 */
const appendDot = (string) => `${string}.`;

test('parseType', ({ end }) => {

	equal(parseType(isString)('abc'), 'abc');
	equal(parseType(isString, appendDot)('abc'), 'abc.');

	throws(() => {
		// @ts-expect-error
		parseType();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		parseType(isString)();
	}, TypeError(`${invalidValue}, ${expected} ${receivedUndefined}`));

	throws(() => {
		parseType(isString)([]);
	}, TypeError(`${invalidValue}, ${expected} but received ${emptyArray}`));

	throws(() => {
		parseType(isString)([[]]);
	}, TypeError(`${invalidValue}, ${expected} but received ${nestedArray}`));

	throws(() => {
		// @ts-expect-error
		parseType(isOptional(isString));
	}, TypeError('Optional type guard cannot be used as base'));

	throws(() => {
		parseType(isTemplateLiteralOf(['a-', isString]))('');
	}, TypeError(`${invalidValue}, ${expectedTemplateLiteral} but received ""`));

	end();
});