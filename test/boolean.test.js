'use strict';

const { test } = require('tap');
const {
	getBoolean,
	isBoolean,
	parseBoolean
} = require('r-assign/lib/boolean');

test('getBoolean', ({ end, equals, throws }) => {

	const getBooleanNoDefault = getBoolean();

	equals(getBooleanNoDefault(), false);
	equals(getBooleanNoDefault(false), false);
	equals(getBooleanNoDefault(true), true);
	equals(getBooleanNoDefault(null), false);

	const getBooleanTrue = getBoolean(true);

	equals(getBooleanTrue(), true);
	equals(getBooleanTrue(false), false);
	equals(getBooleanTrue(true), true);
	equals(getBooleanTrue(null), true);

	throws(() => {
		getBoolean(null);
	});

	end();
});

test('isBoolean', ({ end, notOk, ok }) => {
	notOk(isBoolean());
	ok(isBoolean(false));
	ok(isBoolean(true));
	end();
});

test('parseBoolean', ({ end, equals, throws }) => {
	equals(parseBoolean(false), false);
	throws(() => {
		parseBoolean();
	});
	end();
});