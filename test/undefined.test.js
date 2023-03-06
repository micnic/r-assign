import { test, equal, notOk, ok } from 'tap';
import { isUndefined, undef } from 'r-assign';

test('isUndefined', ({ end }) => {

	equal(isUndefined, undef);

	ok(isUndefined());
	notOk(isUndefined(null));

	end();
});