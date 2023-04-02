import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { asString, isString, string } from 'r-assign';

test('asString', ({ end }) => {

	equal(asString(), 'undefined');
	equal(asString(null), 'null');
	equal(asString(''), '');

	end();
});

test('isString', ({ end }) => {

	equal(isString, string);

	ok(isString(''));

	notOk(isString());

	end();
});

test('assign isString', ({ end }) => {

	equal('', rAssign(isString, ''));

	throws(() => {
		rAssign(isString);
	});

	end();
});