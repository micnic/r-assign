import { test, equal, notOk, ok } from 'tap';
import rAssign, { isUndefined, undef } from 'r-assign';

test('isUndefined', ({ end }) => {

	equal(isUndefined, undef);

	ok(isUndefined());
	ok(isUndefined(undefined));

	notOk(isUndefined(null));

	end();
});

test('assign isUndefined', ({ end }) => {

	equal(undefined, rAssign(isUndefined));
	equal(undefined, rAssign(isUndefined, undefined));

	end();
});