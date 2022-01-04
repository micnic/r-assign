'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	anyDate,
	asAnyDate,
	asDate,
	convertToAnyDate,
	convertToDate,
	date,
	isAnyDate,
	isDate
} = require('r-assign/lib');

test('asAnyDate', ({ end }) => {

	equal(asAnyDate, convertToAnyDate);

	ok(asAnyDate(new Date()) instanceof Date);
	ok(asAnyDate(new Date().getTime()) instanceof Date);
	ok(asAnyDate(new Date().toString()) instanceof Date);

	throws(() => {
		asAnyDate();
	}, TypeError('Invalid date value'));

	end();
});

test('asDate', ({ end }) => {

	equal(asDate, convertToDate);

	ok(asDate(new Date()) instanceof Date);
	ok(asDate(new Date().getTime()) instanceof Date);
	ok(asDate(new Date().toString()) instanceof Date);

	throws(() => {
		asDate();
	}, TypeError('Invalid date value'));

	throws(() => {
		asDate(NaN);
	}, TypeError('Invalid date value'));

	end();
});

test('isAnyDate', ({ end }) => {

	equal(isAnyDate, anyDate);

	ok(isAnyDate(new Date()));
	ok(isAnyDate(new Date(NaN)));

	notOk(isAnyDate(0));

	end();
});

test('isDate', ({ end }) => {

	equal(isDate, date);

	ok(isDate(new Date()));

	notOk(isDate(new Date(NaN)));
	notOk(isAnyDate(0));

	end();
});