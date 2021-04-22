'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	getLiteral,
	getLiteralOf,
	isLiteral,
	isLiteralOf,
	parseLiteral,
	parseLiteralOf
} = require('r-assign/lib/literal');

test('getLiteral', ({ end }) => {

	const getLiteralNull = getLiteral(null);

	equal(getLiteralNull(), null);
	equal(getLiteralNull(null), null);
	equal(getLiteralNull(0), null);

	throws(() => {
		getLiteral();
	});

	end();
});

test('getLiteralOf', ({ end }) => {

	const getLiteralAB = getLiteralOf(['a', 'b']);

	equal(getLiteralAB(), 'a');
	equal(getLiteralAB('b'), 'b');
	equal(getLiteralAB(0), 'a');

	const getLiteralBA = getLiteralOf(['a', 'b'], 'b');

	equal(getLiteralBA(), 'b');
	equal(getLiteralBA('a'), 'a');
	equal(getLiteralBA(0), 'b');

	throws(() => {
		getLiteralOf();
	});

	throws(() => {
		getLiteralOf([null]);
	});

	throws(() => {
		getLiteralOf([{}, {}]);
	});

	throws(() => {
		getLiteralOf(['a', 'b'], 0);
	});

	end();
});

test('isLiteral', ({ end }) => {

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

	throws(() => {
		isLiteral({});
	});

	throws(() => {
		isLiteral(Infinity);
	});

	throws(() => {
		isLiteral(() => null);
	});

	end();
});

test('isLiteralOf', ({ end }) => {

	ok(isLiteralOf(['a', 'b'])('a'));
	notOk(isLiteralOf(['a', 'b'])(0));

	throws(() => {
		isLiteralOf();
	});

	throws(() => {
		isLiteralOf(['a']);
	});

	throws(() => {
		isLiteralOf([{}, {}]);
	});

	end();
});

test('parseLiteral', ({ end }) => {

	const parseLiteralFalse = parseLiteral(false);

	equal(parseLiteralFalse(false), false);

	throws(() => {
		parseLiteralFalse();
	});

	end();
});

test('parseLiteralOf', ({ end }) => {

	const parseLiteralAB = parseLiteralOf(['a', 'b']);

	equal(parseLiteralAB('a'), 'a');

	throws(() => {
		parseLiteralAB();
	});

	end();
});