'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	anyNumber,
	getAnyNumber,
	getNumber,
	isAnyNumber,
	isNumber,
	number,
	parseAnyNumber,
	parseNumber
} = require('r-assign/lib/number');

const expected = 'expected a number value but received';
const expectedFinite = 'expected a finite number value but received';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;

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
		// @ts-expect-error
		getAnyNumber(null);
	}, TypeError(`${invalidDefaultValue}, ${expected} null`));

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
		// @ts-expect-error
		getNumber(null);
	}, TypeError(`${invalidDefaultValue}, ${expectedFinite} null`));

	throws(() => {
		getNumber(NaN);
	}, TypeError(`${invalidDefaultValue}, ${expectedFinite} NaN`));

	throws(() => {
		getNumber(Infinity);
	}, TypeError(`${invalidDefaultValue}, ${expectedFinite} Infinity`));

	throws(() => {
		getNumber(-Infinity);
	}, TypeError(`${invalidDefaultValue}, ${expectedFinite} -Infinity`));

	end();
});

test('isAnyNumber', ({ end }) => {

	equal(isAnyNumber, anyNumber);

	notOk(isAnyNumber());
	ok(isAnyNumber(NaN));
	ok(isAnyNumber(Infinity));
	ok(isAnyNumber(-Infinity));
	ok(isNumber(0));
	end();
});

test('isNumber', ({ end }) => {

	equal(isNumber, number);

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
		// eslint-disable-next-line no-new-wrappers
		parseAnyNumber(new Number);
	}, TypeError(`${invalidValue}, ${expected} an instance of Number`));

	throws(() => {
		parseAnyNumber(null);
	}, TypeError(`${invalidValue}, ${expected} null`));

	throws(() => {
		parseAnyNumber(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expected} null`));

	end();
});

test('parseNumber', ({ end }) => {
	equal(parseNumber(0), 0);

	throws(() => {
		// eslint-disable-next-line no-new-wrappers
		parseNumber(new Number);
	}, TypeError(`${invalidValue}, ${expectedFinite} an instance of Number`));

	throws(() => {
		parseNumber(null);
	}, TypeError(`${invalidValue}, ${expectedFinite} null`));

	throws(() => {
		parseNumber(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expectedFinite} null`));

	throws(() => {
		parseNumber(NaN);
	}, TypeError(`${invalidValue}, ${expectedFinite} NaN`));

	throws(() => {
		parseNumber(NaN, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expectedFinite} NaN`));

	throws(() => {
		parseNumber(Infinity);
	}, TypeError(`${invalidValue}, ${expectedFinite} Infinity`));

	throws(() => {
		parseNumber(Infinity, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expectedFinite} Infinity`));

	throws(() => {
		parseNumber(-Infinity);
	}, TypeError(`${invalidValue}, ${expectedFinite} -Infinity`));

	throws(() => {
		parseNumber(-Infinity, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expectedFinite} -Infinity`));

	end();
});