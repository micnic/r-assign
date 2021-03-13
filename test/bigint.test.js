'use strict';

const { test } = require('tap');
const {
	getBigInt,
	isBigInt,
	parseBigInt
} = require('r-assign/lib/bigint');

test('getBigInt', ({ end, equals, throws }) => {

	const getBigIntNoDefault = getBigInt();

	equals(getBigIntNoDefault(), 0n);
	equals(getBigIntNoDefault(0n), 0n);
	equals(getBigIntNoDefault(1n), 1n);
	equals(getBigIntNoDefault(0), 0n);

	const getBigIntOne = getBigInt(1n);

	equals(getBigIntOne(), 1n);
	equals(getBigIntOne(0n), 0n);
	equals(getBigIntOne(1n), 1n);
	equals(getBigIntOne(0), 1n);

	throws(() => {
		getBigInt(0);
	});

	end();
});

test('isBigInt', ({ end, notOk, ok }) => {
	notOk(isBigInt());
	notOk(isBigInt(0));
	ok(isBigInt(0n));
	end();
});

test('parseBigInt', ({ end, equals, throws }) => {
	equals(parseBigInt(0n), 0n);
	throws(() => {
		parseBigInt();
	});
	end();
});