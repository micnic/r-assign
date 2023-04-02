import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { isSymbol, symbol } from 'r-assign';

test('isSymbol', ({ end }) => {

	equal(isSymbol, symbol);

	notOk(isSymbol());
	ok(isSymbol(Symbol()));

	end();
});

test('assign isSymbol', ({ end }) => {

	const value = Symbol();

	equal(value, rAssign(isSymbol, value));

	throws(() => {
		rAssign(isSymbol);
	});

	end();
});