'use strict';

const { test } = require('tap');
const { getSymbol, isSymbol, parseSymbol } = require('r-assign/lib/symbol');

test('getSymbol', ({ end, equals, matches, throws }) => {

	const getSymbolNoDefault = getSymbol();
	const symbol = Symbol();

	matches(getSymbolNoDefault(), symbol);
	matches(getSymbolNoDefault('data'), symbol);
	matches(getSymbolNoDefault(null), symbol);

	const getSymbolRef = getSymbol(symbol);

	equals(getSymbolRef(), symbol);
	equals(getSymbolRef(symbol), symbol);
	equals(getSymbolRef(null), symbol);

	throws(() => {
		getSymbol(null);
	});

	end();
});

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