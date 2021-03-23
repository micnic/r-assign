'use strict';

const { test } = require('tap');
const {
	getInstanceOf,
	isInstanceOf,
	parseInstanceOf
} = require('r-assign/lib/instance');

test('getInstanceOf', ({ end, matches, throws }) => {

	const getDate = getInstanceOf(Date, new Date());

	matches(getDate(), new Date());
	matches(getDate(new Date()), new Date());

	throws(() => {
		getInstanceOf(Date);
	});

	end();
});

test('isInstanceOf', ({ end, notOk, ok, throws }) => {

	const isDate = isInstanceOf(Date);

	ok(isDate(new Date()));
	notOk(isDate(null));

	throws(() => {
		isInstanceOf();
	});

	end();
});

test('parseInstanceOf', ({ end, matches, throws }) => {

	const parseDate = parseInstanceOf(Date);

	matches(parseDate(new Date()), new Date());

	throws(() => {
		parseDate();
	});

	end();
});