'use strict';

const { test } = require('tap');
const {
	isBoolean,
	useBoolean,
	parseBoolean
} = require('r-assign/lib/boolean');

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

test('useBoolean', ({ end, equals, throws }) => {

	const getBoolean = useBoolean();

	equals(getBoolean(), false);
	equals(getBoolean(false), false);
	equals(getBoolean(true), true);
	equals(getBoolean(null), false);

	const getBooleanTrue = useBoolean(true);

	equals(getBooleanTrue(), true);
	equals(getBooleanTrue(false), false);
	equals(getBooleanTrue(true), true);
	equals(getBooleanTrue(null), true);

	throws(() => {
		useBoolean(null);
	});

	end();
});