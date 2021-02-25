'use strict';

const { test } = require('tap');
const {
	isBigInt,
	useBigInt,
	validateBigInt
} = require('r-assign/lib/bigint');

test('isBigInt', ({ end, notOk, ok }) => {
	notOk(isBigInt());
	notOk(isBigInt(0));
	ok(isBigInt(0n));
	end();
});

test('useBigInt', ({ end, equals, throws }) => {

	const getBigInt = useBigInt();

	equals(getBigInt(), 0n);
	equals(getBigInt(0n), 0n);
	equals(getBigInt(1n), 1n);
	equals(getBigInt(0), 0n);

	const getBigIntOne = useBigInt(1n);

	equals(getBigIntOne(), 1n);
	equals(getBigIntOne(0n), 0n);
	equals(getBigIntOne(1n), 1n);
	equals(getBigIntOne(0), 1n);

	throws(() => {
		useBigInt(0);
	});

	end();
});

test('validateBigInt', ({ end, equals, throws }) => {
	equals(validateBigInt(0n), 0n);
	throws(() => {
		validateBigInt();
	});
	end();
});