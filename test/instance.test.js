'use strict';

const { test, matches, notOk, ok, throws } = require('tap');
const {
	getInstanceOf,
	isInstanceOf,
	parseInstanceOf
} = require('r-assign/lib/instance');

test('getInstanceOf', ({ end }) => {

	const getDate = getInstanceOf(Date, new Date());

	matches(getDate(), new Date());
	matches(getDate(new Date()), new Date());

	throws(() => {
		getInstanceOf(Date);
	});

	end();
});

test('isInstanceOf', ({ end }) => {

	const isDate = isInstanceOf(Date);

	ok(isDate(new Date()));
	notOk(isDate(null));

	throws(() => {
		isInstanceOf();
	});

	end();
});

test('parseInstanceOf', ({ end }) => {

	const parseDate = parseInstanceOf(Date);

	matches(parseDate(new Date()), new Date());

	throws(() => {
		parseDate();
	});

	end();
});