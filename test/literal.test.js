'use strict';

const { test } = require('tap');
const {
	isLiteral,
	useLiteral,
	useLiteralValidation
} = require('r-assign/lib/literal');

test('isLiteral', ({ end, notOk, ok, throws }) => {
	ok(isLiteral(0, 0));
	notOk(isLiteral(0));

	throws(() => {
		isLiteral();
	});

	end();
});

test('useLiteral', ({ end, equals, throws }) => {

	const getLiteralFalse = useLiteral(false);

	equals(getLiteralFalse(), false);
	equals(getLiteralFalse(null), false);
	equals(getLiteralFalse(0), false);

	throws(() => {
		useLiteral();
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