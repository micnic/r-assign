'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	getBoolean,
	isBoolean,
	parseBoolean
} = require('r-assign/lib/boolean');

test('getBoolean', ({ end }) => {

	const getBooleanNoDefault = getBoolean();

	equal(getBooleanNoDefault(), false);
	equal(getBooleanNoDefault(false), false);
	equal(getBooleanNoDefault(true), true);
	equal(getBooleanNoDefault(null), false);

	const getBooleanTrue = getBoolean(true);

	equal(getBooleanTrue(), true);
	equal(getBooleanTrue(false), false);
	equal(getBooleanTrue(true), true);
	equal(getBooleanTrue(null), true);

	throws(() => {
		getBoolean(null);
	});

	end();
});

test('isBoolean', ({ end }) => {
	notOk(isBoolean());
	ok(isBoolean(false));
	ok(isBoolean(true));
	end();
});

test('parseBoolean', ({ end }) => {
	equal(parseBoolean(false), false);
	throws(() => {
		parseBoolean();
	});
	end();
});