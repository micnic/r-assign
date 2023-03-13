import { test, equal, notOk, ok, throws } from 'tap';
import { asNumber, isNumber, number } from 'r-assign';

test('asNumber', ({ end }) => {
	equal(asNumber(0), 0);
	equal(asNumber(''), 0);

	throws(() => {
		asNumber();
	}, TypeError('Invalid number value'));

	end();
});

test('isNumber', ({ end }) => {
	equal(isNumber, number);

	ok(isNumber(0));

	notOk(isNumber());
	notOk(isNumber(NaN));
	notOk(isNumber(Infinity));
	notOk(isNumber(-Infinity));

	end();
});