import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { asBoolean, boolean, isBoolean } from 'r-assign';

test('asBoolean', ({ end }) => {

	equal(asBoolean(true), true);
	equal(asBoolean(false), false);
	equal(asBoolean(), false);
	equal(asBoolean(null), false);
	equal(asBoolean(''), false);

	end();
});

test('isBoolean', ({ end }) => {

	equal(isBoolean, boolean);

	ok(isBoolean(true));
	ok(isBoolean(false));

	notOk(isBoolean());

	end();
});

test('assign isBoolean', ({ end }) => {

	equal(false, rAssign(isBoolean, false));
	equal(true, rAssign(isBoolean, true));

	throws(() => {
		rAssign(isBoolean);
	});

	end();
});