'use strict';

const { test } = require('tap');
const {
	isLiteral,
	isLiteralOf,
	useLiteral,
	useLiteralOf,
	useLiteralOfValidation,
	useLiteralValidation
} = require('r-assign/lib/literal');

test('isLiteral', ({ end, notOk, ok, throws }) => {

	const symbol = Symbol();

	ok(isLiteral(null, null));
	ok(isLiteral(0n, 0n));
	ok(isLiteral(false, false));
	ok(isLiteral(0, 0));
	ok(isLiteral('', ''));
	ok(isLiteral(symbol, symbol));
	notOk(isLiteral(0));

	throws(() => {
		isLiteral();
	});

	end();
});

test('isLiteralOf', ({ end, notOk, ok, throws }) => {

	ok(isLiteralOf([null], null));
	notOk(isLiteralOf(['a', 'b'], ''));

	throws(() => {
		isLiteralOf();
	});

	throws(() => {
		isLiteralOf([]);
	});

	throws(() => {
		isLiteralOf([[]]);
	});

	end();
});

test('useLiteral', ({ end, equals, throws }) => {

	const getLiteralNull = useLiteral(null);

	equals(getLiteralNull(), null);
	equals(getLiteralNull(null), null);
	equals(getLiteralNull(0), null);

	throws(() => {
		useLiteral();
	});

	end();
});

test('useLiteralOf', ({ end, equals, throws }) => {

	const getLiteralFalsy = useLiteralOf([null, false, '', 0, 0n], null);

	equals(getLiteralFalsy(null), null);
	equals(getLiteralFalsy(false), false);
	equals(getLiteralFalsy(''), '');
	equals(getLiteralFalsy(0), 0);
	equals(getLiteralFalsy(0n), 0n);
	equals(getLiteralFalsy(1), null);

	throws(() => {
		useLiteralOf();
	});

	throws(() => {
		useLiteralOf([null]);
	});

	end();
});

test('useLiteralOfValidation', ({ end, equals, throws }) => {

	const getLiteralFalsy = useLiteralOfValidation([null, false, '', 0, 0n]);

	equals(getLiteralFalsy(''), '');

	throws(() => {
		getLiteralFalsy(1);
	});

	end();
});

test('useLiteralValidation', ({ end, equals, throws }) => {

	const getLiteralFalse = useLiteralValidation(false);

	equals(getLiteralFalse(false), false);

	throws(() => {
		getLiteralFalse();
	});

	end();
});