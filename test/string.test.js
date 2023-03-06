import { test, equal, notOk, ok } from 'tap';
import { asString, isString, string } from 'r-assign';

test('asString', ({ end }) => {

	equal(asString(), 'undefined');
	equal(asString(null), 'null');
	equal(asString(''), '');

	end();
});

test('isString', ({ end }) => {

	equal(isString, string);

	notOk(isString());
	ok(isString(''));
	end();
});