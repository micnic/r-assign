import { test, equal, notOk } from 'tap';
import { isNever, never } from 'r-assign';

test('isNever', ({ end }) => {
	equal(isNever, never);

	notOk(isNever());
	notOk(isNever(null));

	end();
});