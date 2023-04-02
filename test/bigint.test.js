import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { asBigInt, bigint, isBigInt } from 'r-assign';

test('asBigInt', ({ end }) => {

	equal(asBigInt(0n), 0n);
	equal(asBigInt(0), 0n);
	equal(asBigInt(false), 0n);
	equal(asBigInt(''), 0n);

	throws(() => {
		asBigInt();
	}, TypeError('Invalid BigInt value'));

	end();
});

test('isBigInt', ({ end }) => {

	equal(isBigInt, bigint);

	ok(isBigInt(0n));

	notOk(isBigInt());
	notOk(isBigInt(0));

	end();
});

test('assign isBigInt', ({ end }) => {

	equal(0n, rAssign(isBigInt, 0n));

	throws(() => {
		rAssign(isBigInt);
	});

	end();
});