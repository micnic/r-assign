import { test, equal, notOk, ok, throws } from 'tap';
import { instance, isInstanceOf } from 'r-assign';

test('isInstanceOf', ({ end }) => {

	const isDate = isInstanceOf(Date);

	equal(isInstanceOf, instance);

	ok(isDate(new Date()));
	notOk(isDate(null));

	throws(() => {
		// @ts-expect-error
		isInstanceOf();
	}, TypeError('Invalid constructor provided'));

	end();
});