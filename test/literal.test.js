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

const expectedFalse = 'expected false literal';
const expectedLiterals = 'expected a union of literals ("a" | "b")';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const received = 'but received null';
const receivedStringFalse = 'but received "false"';

test('getLiteral', ({ end }) => {

	const getNullLiteral = getLiteral(null);

	equal(getNullLiteral(), null);
	equal(getNullLiteral(null), null);
	equal(getNullLiteral(0), null);

	throws(() => {
		getLiteral({});
	}, TypeError('Invalid literal provided'));

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
	}, TypeError('Invalid literals provided'));

	throws(() => {
		getLiteralOf([null]);
	}, TypeError('Not enough literals, at least two expected'));

	throws(() => {
		getLiteralOf([{}, {}]);
	}, TypeError('Invalid literal provided'));

	throws(() => {
		getLiteralOf(['a', 'b'], null);
	}, TypeError(`${invalidDefaultValue}, ${expectedLiterals} ${received}`));

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
		isLiteral({});
	}, TypeError('Invalid literal provided'));

	throws(() => {
		isLiteral(Infinity);
	}, TypeError('Invalid literal provided'));

	throws(() => {
		isLiteral(() => null);
	}, TypeError('Invalid literal provided'));

	end();
});

test('isLiteralOf', ({ end }) => {

	ok(isLiteralOf(['a', 'b'])('a'));
	notOk(isLiteralOf(['a', 'b'])(0));

	throws(() => {
		isLiteralOf();
	}, TypeError('Invalid literals provided'));

	throws(() => {
		isLiteralOf(['a']);
	}, TypeError('Not enough literals, at least two expected'));

	throws(() => {
		isLiteralOf(['a', 'a']);
	}, TypeError('Duplicate literal provided'));

	end();
});

test('parseLiteral', ({ end }) => {

	const parseLiteralFalse = parseLiteral(false);

	equal(parseLiteralFalse(false), false);

	throws(() => {
		parseLiteralFalse(null);
	}, TypeError(`${invalidValue}, ${expectedFalse} ${received}`));

	throws(() => {
		parseLiteralFalse('false');
	}, TypeError(`${invalidValue}, ${expectedFalse} ${receivedStringFalse}`));

	end();
});

test('parseLiteralOf', ({ end }) => {

	const parseLiteralAB = parseLiteralOf(['a', 'b']);

	equal(parseLiteralAB('a'), 'a');

	throws(() => {
		parseLiteralAB(null);
	}, TypeError(`${invalidValue}, ${expectedLiterals} ${received}`));

	end();
});