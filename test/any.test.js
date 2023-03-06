import { test, equal, ok } from 'tap';
import { any, isAny } from 'r-assign';

test('isAny', ({ end }) => {
	equal(isAny, any);

	ok(isAny());
	ok(isAny(null));

	end();
});