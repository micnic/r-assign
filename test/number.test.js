import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { asNumber, isNumber, number } from 'r-assign';

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

test('assign isNumber', ({ end }) => {

	equal(0, rAssign(isNumber, 0));

	throws(() => {
		rAssign(isNumber);
	});

	throws(() => {
		rAssign(isNumber, NaN);
	});

	throws(() => {
		rAssign(isNumber, Infinity);
	});

	throws(() => {
		rAssign(isNumber, -Infinity);
	});

	end();
});