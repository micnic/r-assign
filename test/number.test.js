'use strict';

const { test } = require('tap');
const { getNumber, isNumber, parseNumber } = require('r-assign/lib/number');

test('getNumber', ({ end, equals, throws }) => {

	const getNumberNoDefault = getNumber();

	equals(getNumberNoDefault(), 0);
	equals(getNumberNoDefault(1), 1);
	equals(getNumberNoDefault(null), 0);
	equals(getNumberNoDefault(NaN), 0);
	equals(getNumberNoDefault(Infinity), 0);
	equals(getNumberNoDefault(-Infinity), 0);

	const getNumberOne = getNumber(1);

	equals(getNumberOne(), 1);
	equals(getNumberOne(1), 1);
	equals(getNumberOne(null), 1);
	equals(getNumberOne(NaN), 1);
	equals(getNumberOne(Infinity), 1);
	equals(getNumberOne(-Infinity), 1);

	throws(() => {
		getNumber(null);
	});

	throws(() => {
		getNumber(NaN);
	});

	throws(() => {
		getNumber(Infinity);
	});

	throws(() => {
		getNumber(-Infinity);
	});

	end();
});

test('isNumber', ({ end, notOk, ok }) => {
	notOk(isNumber());
	notOk(isNumber(NaN));
	notOk(isNumber(Infinity));
	notOk(isNumber(-Infinity));
	ok(isNumber(0));
	end();
});

test('parseNumber', ({ end, equals, throws }) => {
	equals(parseNumber(0), 0);
	throws(() => {
		parseNumber();
	});
	end();
});