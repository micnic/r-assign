import { test, equal, notOk, ok } from 'tap';
import { bigint, isBigInt } from 'r-assign';

test('isBigInt', ({ end }) => {
	equal(isBigInt, bigint);

	notOk(isBigInt());
	notOk(isBigInt(0));
	ok(isBigInt(0n));
	end();
});