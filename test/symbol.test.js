'use strict';

const { test, equal, match, notOk, ok, throws } = require('tap');
const { getSymbol, isSymbol, parseSymbol } = require('r-assign/lib/symbol');

test('getSymbol', ({ end }) => {

	const getSymbolNoDefault = getSymbol();
	const symbol = Symbol();

	match(getSymbolNoDefault(), symbol);
	match(getSymbolNoDefault('data'), symbol);
	match(getSymbolNoDefault(null), symbol);

	const getSymbolRef = getSymbol(symbol);

	equal(getSymbolRef(), symbol);
	equal(getSymbolRef(symbol), symbol);
	equal(getSymbolRef(null), symbol);

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

	equal(parseSymbol(symbol), symbol);
	throws(() => {
		parseSymbol();
	});
	end();
});