'use strict';

const { test } = require('tap');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isObjectOf } = require('r-assign/lib/object');
const { isString } = require('r-assign/lib/string');
const {
	getIntersectionOf,
	isIntersectionOf,
	parseIntersectionOf
} = require('r-assign/lib/intersection');

test('getIntersectionOf', ({ end, matches, throws }) => {

	const getIntersectionOfNumberString = getIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})], { number: 0, string: '' });

	matches(getIntersectionOfNumberString(), { number: 0, string: '' });
	matches(getIntersectionOfNumberString(null), { number: 0, string: '' });
	matches(getIntersectionOfNumberString({
		number: 1
	}), { number: 0, string: '' });
	matches(getIntersectionOfNumberString({
		number: 1,
		string: 'data'
	}), { number: 1, string: 'data' });

	throws(() => {
		getIntersectionOf();
	});

	throws(() => {
		getIntersectionOf([null]);
	});

	throws(() => {
		getIntersectionOf([() => null]);
	});

	throws(() => {
		getIntersectionOf([isNumber, isString], null);
	});

	throws(() => {
		getIntersectionOf([isObjectOf({
			number: isNumber
		}), isObjectOf({
			string: isString
		})], null);
	});

	end();
});

test('isIntersectionOf', ({ end, notOk, ok, throws }) => {

	ok(isIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})])({ number: 0, string: '' }));
	notOk(isIntersectionOf([isBoolean, isNumber])(true));

	throws(() => {
		isIntersectionOf();
	});

	throws(() => {
		isIntersectionOf([]);
	});

	throws(() => {
		isIntersectionOf([null]);
	});

	throws(() => {
		isIntersectionOf([null, null]);
	});

	throws(() => {
		isIntersectionOf([() => null, () => null]);
	});

	end();
});

test('parseIntersectionOf', ({ end, matches, throws }) => {

	const parseIntersectionOfNumberString = parseIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})]);

	matches(parseIntersectionOfNumberString({
		number: 1,
		string: 'data'
	}), {
		number: 1,
		string: 'data'
	});

	throws(() => {
		parseIntersectionOfNumberString(null);
	});

	end();
});