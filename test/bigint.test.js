'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	getBigInt,
	isBigInt,
	parseBigInt
} = require('r-assign/lib/bigint');

test('getBigInt', ({ end }) => {

	const getBigIntNoDefault = getBigInt();

	equal(getBigIntNoDefault(), 0n);
	equal(getBigIntNoDefault(0n), 0n);
	equal(getBigIntNoDefault(1n), 1n);
	equal(getBigIntNoDefault(0), 0n);

	const getBigIntOne = getBigInt(1n);

	equal(getBigIntOne(), 1n);
	equal(getBigIntOne(0n), 0n);
	equal(getBigIntOne(1n), 1n);
	equal(getBigIntOne(0), 1n);

	throws(() => {
		getBigInt(0);
	});

	end();
});

test('isBigInt', ({ end }) => {
	notOk(isBigInt());
	notOk(isBigInt(0));
	ok(isBigInt(0n));
	end();
});

test('parseBigInt', ({ end }) => {
	equal(parseBigInt(0n), 0n);
	throws(() => {
		parseBigInt();
	});
	end();
});