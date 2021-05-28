'use strict';

const { test, match, ok, throws } = require('tap');
const { isAny } = require('r-assign/lib/any');
const { isNumber } = require('r-assign/lib/number');
const { isObjectOf } = require('r-assign/lib/object');
const { isString } = require('r-assign/lib/string');
const {
	getIntersectionOf,
	isIntersectionOf,
	parseIntersectionOf
} = require('r-assign/lib/intersection');

const numberObject = '{\n "number": number;\n}';
const stringObject = '{\n "string": string;\n}';
const intersectionAnnotation = `(${numberObject} & ${stringObject})`;
const expected = `expected an intersection of ${intersectionAnnotation}`;
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received null';

test('getIntersectionOf', ({ end }) => {

	const getIntersectionOfNumberString = getIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})], { number: 0, string: '' });

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
		isIntersectionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		isIntersectionOf([]);
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		isIntersectionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isIntersectionOf([isAny, isString]);
	}, TypeError('Provided intersection of any'));

	throws(() => {
		isIntersectionOf([isNumber, isString]);
	}, TypeError('Provided intersection is impossible'));

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