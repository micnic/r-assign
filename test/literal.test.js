'use strict';

const { test } = require('tap');
const {
	getLiteral,
	isLiteral,
	parseLiteral
} = require('r-assign/lib/literal');

test('getLiteral', ({ end, equals, throws }) => {

	const getLiteralNull = getLiteral(null);

	equals(getLiteralNull(), null);
	equals(getLiteralNull(null), null);
	equals(getLiteralNull(0), null);

	throws(() => {
		getLiteral();
	});

	end();
});

test('isLiteral', ({ end, notOk, ok, throws }) => {

	const symbol = Symbol();

	ok(isLiteral(null)(null));
	ok(isLiteral(0n)(0n));
	ok(isLiteral(false)(false));
	ok(isLiteral(0)(0));
	ok(isLiteral('')(''));
	ok(isLiteral(symbol)(symbol));
	notOk(isLiteral(0)());

	throws(() => {
		isLiteral();
	});

	end();
});

test('parseLiteral', ({ end, equals, throws }) => {

	const getLiteralFalse = parseLiteral(false);

	equals(getLiteralFalse(false), false);

	throws(() => {
		getLiteralFalse();
	});

	end();
});