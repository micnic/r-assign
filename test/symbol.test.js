'use strict';

const { test } = require('tap');
const { isSymbol, useSymbol, parseSymbol } = require('r-assign/lib/symbol');

test('isSymbol', ({ end, notOk, ok }) => {
	notOk(isSymbol());
	ok(isSymbol(Symbol()));
	end();
});

test('parseSymbol', ({ end, equals, throws }) => {

	const symbol = Symbol();

	equals(parseSymbol(symbol), symbol);
	throws(() => {
		parseSymbol();
	});
	end();
});

test('useString', ({ end, equals, matches, throws }) => {

	const getSymbol = useSymbol();
	const symbol = Symbol();

	matches(getSymbol(), symbol);
	matches(getSymbol('data'), symbol);
	matches(getSymbol(null), symbol);

	const getSymbolRef = useSymbol(symbol);

	equals(getSymbolRef(), symbol);
	equals(getSymbolRef(symbol), symbol);
	equals(getSymbolRef(null), symbol);

	throws(() => {
		useSymbol(null);
	});

	end();
});