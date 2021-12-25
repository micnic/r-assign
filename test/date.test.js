'use strict';

const { test, notOk, ok, throws } = require('tap');
const {
	convertToAnyDate,
	convertToDate,
	isAnyDate,
	isDate
} = require('r-assign/lib');

test('convertToAnyDate', ({ end }) => {

	ok(convertToAnyDate(new Date()) instanceof Date);
	ok(convertToAnyDate(new Date().getTime()) instanceof Date);
	ok(convertToAnyDate(new Date().toString()) instanceof Date);

	throws(() => {
		convertToAnyDate();
	}, TypeError('Invalid date value'));

	end();
});

test('convertToDate', ({ end }) => {

	ok(convertToDate(new Date()) instanceof Date);
	ok(convertToDate(new Date().getTime()) instanceof Date);
	ok(convertToDate(new Date().toString()) instanceof Date);

	throws(() => {
		convertToDate();
	}, TypeError('Invalid date value'));

	throws(() => {
		convertToDate(NaN);
	}, TypeError('Invalid date value'));

	end();
});

test('isAnyDate', ({ end }) => {

	ok(isAnyDate(new Date()));
	ok(isAnyDate(new Date(NaN)));

	notOk(isAnyDate(0));

	end();
});

test('isDate', ({ end }) => {

	ok(isDate(new Date()));

	notOk(isDate(new Date(NaN)));
	notOk(isAnyDate(0));

	end();
});