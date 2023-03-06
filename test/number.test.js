import { test, equal, notOk, ok } from 'tap';
import { isNumber, number } from 'r-assign';

test('isNumber', ({ end }) => {

	equal(isNumber, number);

	notOk(isNumber());
	notOk(isNumber(NaN));
	notOk(isNumber(Infinity));
	notOk(isNumber(-Infinity));
	ok(isNumber(0));
	end();
});