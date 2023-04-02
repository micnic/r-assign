import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { asDate, date, isDate } from 'r-assign';

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

test('assign isDate', ({ end }) => {

	const value = new Date();

	equal(value, rAssign(isDate, value));

	throws(() => {
		rAssign(isDate);
	});

	throws(() => {
		rAssign(isDate, new Date(NaN));
	});

	end();
});