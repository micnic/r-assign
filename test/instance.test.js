import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { instance, isInstanceOf } from 'r-assign';

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

test('assign isInstanceOf', ({ end }) => {

	const value = new Date();

	equal(value, rAssign(isInstanceOf(Date), value));

	throws(() => {
		rAssign(isInstanceOf(Date));
	});

	end();
});