'use strict';

const { test, match, notOk, ok, throws } = require('tap');
const {
	getInstanceOf,
	isInstanceOf,
	parseInstanceOf
} = require('r-assign/lib/instance');

test('getInstanceOf', ({ end }) => {

	const getDate = getInstanceOf(Date, new Date());

	match(getDate(), new Date());
	match(getDate(new Date()), new Date());

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

	match(parseDate(new Date()), new Date());

	throws(() => {
		parseDate();
	});

	end();
});