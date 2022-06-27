'use strict';

const { test, match, ok, throws } = require('tap');
const {
	getIntersectionOf,
	isAny,
	isIntersectionOf,
	isNumber,
	isObjectOf,
	isOptional,
	isString,
	parseIntersectionOf
} = require('r-assign/lib');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TG
 */

const numberObject = '{\n "number": number;\n}';
const stringObject = '{\n "string": string;\n}';
const intersectionAnnotation = `(${numberObject} & ${stringObject})`;
const expected = `expected an intersection of ${intersectionAnnotation}`;
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received null';

test('getIntersectionOf', ({ end }) => {

	/** @type {[TG<{ number: number }>, TG<{ string: string }>]} */
	const intersection = [isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})];

	const getIntersectionOfNumberString = getIntersectionOf(
		intersection,
		{ number: 0, string: '' }
	);

	match(getIntersectionOfNumberString(), { number: 0, string: '' });
	match(getIntersectionOfNumberString(null), { number: 0, string: '' });
	match(getIntersectionOfNumberString({
		number: 1
	}), { number: 0, string: '' });
	match(getIntersectionOfNumberString({
		number: 1,
		string: 'data'
	}), { number: 1, string: 'data' });

	throws(() => {
		getIntersectionOf([isObjectOf({
			number: isNumber
		}), isObjectOf({
			string: isString
		// @ts-expect-error
		})], null);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${received}`));

	end();
});

test('isIntersectionOf', ({ end }) => {

	ok(isIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})])({ number: 0, string: '' }));

	throws(() => {
		// @ts-expect-error
		isIntersectionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		// @ts-expect-error
		isIntersectionOf([]);
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		// @ts-expect-error
		isIntersectionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isIntersectionOf([isAny, isString]);
	}, TypeError('Provided intersection of any'));

	throws(() => {
		isIntersectionOf([isNumber, isString]);
	}, TypeError('Provided intersection is impossible'));

	throws(() => {
		isIntersectionOf([isOptional(isNumber), isString]);
	}, TypeError('Optional type cannot be used in intersection declaration'));

	end();
});

test('parseIntersectionOf', ({ end }) => {

	const parseIntersectionOfNumberString = parseIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})]);

	match(parseIntersectionOfNumberString({
		number: 1,
		string: 'data'
	}), {
		number: 1,
		string: 'data'
	});

	throws(() => {
		parseIntersectionOfNumberString(null);
	}, TypeError(`${invalidValue}, ${expected} ${received}`));

	end();
});