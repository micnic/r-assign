import { test, equal, notOk, ok } from 'tap';
import { boolean, isBoolean } from 'r-assign';

test('isBoolean', ({ end }) => {
	equal(isBoolean, boolean);

	notOk(isBoolean());
	ok(isBoolean(false));
	ok(isBoolean(true));
	end();
});