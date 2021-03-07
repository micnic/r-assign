'use strict';

const { test } = require('tap');
const { isNumber, useNumber, parseNumber } = require('r-assign/lib/number');

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

test('useNumber', ({ end, equals, throws }) => {

	const getNumber = useNumber();

	equals(getNumber(), 0);
	equals(getNumber(1), 1);
	equals(getNumber(null), 0);
	equals(getNumber(NaN), 0);
	equals(getNumber(Infinity), 0);
	equals(getNumber(-Infinity), 0);

	const getNumberOne = useNumber(1);

	equals(getNumberOne(), 1);
	equals(getNumberOne(1), 1);
	equals(getNumberOne(null), 1);
	equals(getNumberOne(NaN), 1);
	equals(getNumberOne(Infinity), 1);
	equals(getNumberOne(-Infinity), 1);

	throws(() => {
		useNumber(null);
	});

	throws(() => {
		useNumber(NaN);
	});

	throws(() => {
		useNumber(Infinity);
	});

	throws(() => {
		useNumber(-Infinity);
	});

	end();
});