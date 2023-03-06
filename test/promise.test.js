import { test, equal, ok } from 'tap';
import { isPromiseOf, isString, promise } from 'r-assign';

test('isPromiseOf', ({ end }) => {

	equal(isPromiseOf, promise);

	ok(isPromiseOf()(Promise.resolve()));
	ok(isPromiseOf(isString)(Promise.resolve('abc')));

	end();
});