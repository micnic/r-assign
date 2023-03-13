import { test, equal, notOk, ok, throws } from 'tap';
import { asBigInt, bigint, isBigInt } from 'r-assign';

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