'use strict';

const { test, equals, matches, notOk, ok, throws } = require('tap');
const { getSymbol, isSymbol, parseSymbol } = require('r-assign/lib/symbol');

test('getSymbol', ({ end }) => {

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

test('isSymbol', ({ end }) => {
	notOk(isSymbol());
	ok(isSymbol(Symbol()));
	end();
});

test('parseSymbol', ({ end }) => {

	const symbol = Symbol();

	equals(parseSymbol(symbol), symbol);
	throws(() => {
		parseSymbol();
	});
	end();
});