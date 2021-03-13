'use strict';

const { test } = require('tap');
const {
	isObjectOf,
	getObjectOf,
	parseObjectOf
} = require('r-assign/lib/object');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');

test('getObjectOf', ({ end, matches, throws }) => {

	const getObjectABC = getObjectOf({ abc: isString }, { abc: '' });

	matches(getObjectABC(), { abc: '' });
	matches(getObjectABC({ abc: '' }), { abc: '' });
	matches(getObjectABC({ abc: 'abc' }), { abc: 'abc' });

	throws(() => {
		getObjectOf();
	});

	throws(() => {
		getObjectOf(null);
	});

	throws(() => {
		getObjectOf(0);
	});

	throws(() => {
		getObjectOf({ abc: isString });
	});

	throws(() => {
		getObjectOf({ abc: isString }, {});
	});

	throws(() => {
		getObjectOf({ abc: null }, {});
	});

	throws(() => {
		getObjectOf({ abc: () => null }, {});
	});

	end();
});

test('isObjectOf', ({ end, notOk, ok, throws }) => {

	ok(isObjectOf({ boolean: isBoolean }, { boolean: false }));
	ok(isObjectOf({
		number: isNumber,
		string: isString
	}, { boolean: false, number: 0, string: '' }));
	notOk(isObjectOf({ boolean: isBoolean }, null));
	notOk(isObjectOf({ boolean: isBoolean }, { boolean: 0 }));

	throws(() => {
		isObjectOf();
	});

	throws(() => {
		isObjectOf(null);
	});

	throws(() => {
		isObjectOf(0);
	});

	end();
});

test('parseObjectOf', ({ end, matches, throws }) => {

	const validateObjectABC = parseObjectOf({ abc: isString });

	matches(validateObjectABC({ abc: '' }), { abc: '' });

	throws(() => {
		validateObjectABC();
	});

	end();
});