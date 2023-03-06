import { test, equal, notOk, ok } from 'tap';
import { isSymbol, symbol } from 'r-assign';

test('isSymbol', ({ end }) => {

	equal(isSymbol, symbol);

	notOk(isSymbol());
	ok(isSymbol(Symbol()));

	end();
});