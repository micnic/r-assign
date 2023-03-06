import { test, equal, notOk, ok, throws } from 'tap';
import { asDate, date, isDate } from 'r-assign';

test('asDate', ({ end }) => {

	ok(asDate(new Date()) instanceof Date);
	ok(asDate(new Date().getTime()) instanceof Date);
	ok(asDate(new Date().toString()) instanceof Date);

	throws(() => {
		asDate();
	}, TypeError('Invalid date value'));

	throws(() => {
		asDate(NaN);
	}, TypeError('Invalid date value'));

	end();
});

test('isDate', ({ end }) => {

	equal(isDate, date);

	ok(isDate(new Date()));

	notOk(isDate(new Date(NaN)));
	notOk(isDate(0));

	end();
});