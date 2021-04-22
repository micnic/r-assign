'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	getAnyNumber,
	getNumber,
	isAnyNumber,
	isNumber,
	parseAnyNumber,
	parseNumber
} = require('r-assign/lib/number');

test('getAnyNumber', ({ end }) => {

	const getNumberNoDefault = getAnyNumber();

	equal(getNumberNoDefault(), 0);
	equal(getNumberNoDefault(1), 1);
	equal(getNumberNoDefault(null), 0);
	ok(Number.isNaN(getNumberNoDefault(NaN)));
	equal(getNumberNoDefault(Infinity), Infinity);
	equal(getNumberNoDefault(-Infinity), -Infinity);

	const getNumberOneDefault = getAnyNumber(1);

	equal(getNumberOneDefault(), 1);
	equal(getNumberOneDefault(1), 1);
	equal(getNumberOneDefault(null), 1);
	ok(Number.isNaN(getNumberOneDefault(NaN)));
	equal(getNumberOneDefault(Infinity), Infinity);
	equal(getNumberOneDefault(-Infinity), -Infinity);

	const getNumberNaNDefault = getAnyNumber(NaN);

	ok(Number.isNaN(getNumberNaNDefault()));
	equal(getNumberNaNDefault(1), 1);
	ok(Number.isNaN(getNumberNaNDefault(null)));
	ok(Number.isNaN(getNumberNaNDefault(NaN)));
	equal(getNumberNaNDefault(Infinity), Infinity);
	equal(getNumberNaNDefault(-Infinity), -Infinity);

	const getNumberInfinityDefault = getAnyNumber(Infinity);

	equal(getNumberInfinityDefault(), Infinity);
	equal(getNumberInfinityDefault(1), 1);
	equal(getNumberInfinityDefault(null), Infinity);
	ok(Number.isNaN(getNumberInfinityDefault(NaN)));
	equal(getNumberInfinityDefault(Infinity), Infinity);
	equal(getNumberInfinityDefault(-Infinity), -Infinity);

	throws(() => {
		getAnyNumber(null);
	});

	end();
});

test('getNumber', ({ end }) => {

	const getNumberNoDefault = getNumber();

	equal(getNumberNoDefault(), 0);
	equal(getNumberNoDefault(1), 1);
	equal(getNumberNoDefault(null), 0);
	equal(getNumberNoDefault(NaN), 0);
	equal(getNumberNoDefault(Infinity), 0);
	equal(getNumberNoDefault(-Infinity), 0);

	const getNumberOneDefault = getNumber(1);

	equal(getNumberOneDefault(), 1);
	equal(getNumberOneDefault(1), 1);
	equal(getNumberOneDefault(null), 1);
	equal(getNumberOneDefault(NaN), 1);
	equal(getNumberOneDefault(Infinity), 1);
	equal(getNumberOneDefault(-Infinity), 1);

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

test('isAnyNumber', ({ end }) => {
	notOk(isAnyNumber());
	ok(isAnyNumber(NaN));
	ok(isAnyNumber(Infinity));
	ok(isAnyNumber(-Infinity));
	ok(isNumber(0));
	end();
});

test('isNumber', ({ end }) => {
	notOk(isNumber());
	notOk(isNumber(NaN));
	notOk(isNumber(Infinity));
	notOk(isNumber(-Infinity));
	ok(isNumber(0));
	end();
});

test('parseAnyNumber', ({ end }) => {
	equal(parseAnyNumber(0), 0);
	ok(Number.isNaN(parseAnyNumber(NaN)));
	equal(parseAnyNumber(Infinity), Infinity);
	equal(parseAnyNumber(-Infinity), -Infinity);

	throws(() => {
		parseAnyNumber();
	});

	end();
});

test('parseNumber', ({ end }) => {
	equal(parseNumber(0), 0);

	throws(() => {
		parseNumber();
	});

	throws(() => {
		parseNumber(NaN);
	});

	throws(() => {
		parseNumber(Infinity);
	});

	throws(() => {
		parseNumber(-Infinity);
	});

	end();
});