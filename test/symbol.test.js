'use strict';

const { test, equal, match, notOk, ok, throws } = require('tap');
const { getSymbol, isSymbol, parseSymbol } = require('r-assign/lib/symbol');

const expected = 'expected a symbol value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedString = 'but received a value of type string';

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
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

	throws(() => {
		getSymbol('');
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedString}`));

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
		parseSymbol(null);
	}, TypeError(`${invalidValue}, ${expected} ${receivedNull}`));

	throws(() => {
		parseSymbol('');
	}, TypeError(`${invalidValue}, ${expected} ${receivedString}`));

	throws(() => {
		parseSymbol(null, 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expected} ${receivedNull}`));

	throws(() => {
		parseSymbol('', 'key');
	}, TypeError(`${invalidValueWithProperty}, ${expected} ${receivedString}`));

	end();
});