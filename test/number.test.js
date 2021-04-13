'use strict';

const { test, equals, notOk, ok, throws } = require('tap');
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

	equals(getNumberNoDefault(), 0);
	equals(getNumberNoDefault(1), 1);
	equals(getNumberNoDefault(null), 0);
	ok(Number.isNaN(getNumberNoDefault(NaN)));
	equals(getNumberNoDefault(Infinity), Infinity);
	equals(getNumberNoDefault(-Infinity), -Infinity);

	const getNumberOneDefault = getAnyNumber(1);

	equals(getNumberOneDefault(), 1);
	equals(getNumberOneDefault(1), 1);
	equals(getNumberOneDefault(null), 1);
	ok(Number.isNaN(getNumberOneDefault(NaN)));
	equals(getNumberOneDefault(Infinity), Infinity);
	equals(getNumberOneDefault(-Infinity), -Infinity);

	const getNumberNaNDefault = getAnyNumber(NaN);

	ok(Number.isNaN(getNumberNaNDefault()));
	equals(getNumberNaNDefault(1), 1);
	ok(Number.isNaN(getNumberNaNDefault(null)));
	ok(Number.isNaN(getNumberNaNDefault(NaN)));
	equals(getNumberNaNDefault(Infinity), Infinity);
	equals(getNumberNaNDefault(-Infinity), -Infinity);

	const getNumberInfinityDefault = getAnyNumber(Infinity);

	equals(getNumberInfinityDefault(), Infinity);
	equals(getNumberInfinityDefault(1), 1);
	equals(getNumberInfinityDefault(null), Infinity);
	ok(Number.isNaN(getNumberInfinityDefault(NaN)));
	equals(getNumberInfinityDefault(Infinity), Infinity);
	equals(getNumberInfinityDefault(-Infinity), -Infinity);

	throws(() => {
		getAnyNumber(null);
	});

	end();
});

test('getNumber', ({ end }) => {

	const getNumberNoDefault = getNumber();

	equals(getNumberNoDefault(), 0);
	equals(getNumberNoDefault(1), 1);
	equals(getNumberNoDefault(null), 0);
	equals(getNumberNoDefault(NaN), 0);
	equals(getNumberNoDefault(Infinity), 0);
	equals(getNumberNoDefault(-Infinity), 0);

	const getNumberOneDefault = getNumber(1);

	equals(getNumberOneDefault(), 1);
	equals(getNumberOneDefault(1), 1);
	equals(getNumberOneDefault(null), 1);
	equals(getNumberOneDefault(NaN), 1);
	equals(getNumberOneDefault(Infinity), 1);
	equals(getNumberOneDefault(-Infinity), 1);

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
	equals(parseAnyNumber(0), 0);
	ok(Number.isNaN(parseAnyNumber(NaN)));
	equals(parseAnyNumber(Infinity), Infinity);
	equals(parseAnyNumber(-Infinity), -Infinity);

	throws(() => {
		parseAnyNumber();
	});

	end();
});

test('parseNumber', ({ end }) => {
	equals(parseNumber(0), 0);

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