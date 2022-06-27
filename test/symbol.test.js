'use strict';

const { test, equal, match, notOk, ok, throws } = require('tap');
const {
	getSymbol,
	isSymbol,
	parseSymbol,
	symbol
} = require('r-assign/lib/symbol');

const expected = 'expected a symbol value';
const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const invalidValueWithProperty = `${invalidValue} for property "key"`;
const receivedNull = 'but received null';
const receivedString = 'but received a value of type string';

test('getSymbol', ({ end }) => {

	const getSymbolNoDefault = getSymbol();
	const s = Symbol();

	match(getSymbolNoDefault(), s);
	match(getSymbolNoDefault('data'), s);
	match(getSymbolNoDefault(null), s);

	const getSymbolRef = getSymbol(s);

	equal(getSymbolRef(), s);
	equal(getSymbolRef(s), s);
	equal(getSymbolRef(null), s);

	throws(() => {
		// @ts-expect-error
		getSymbol(null);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedNull}`));

	throws(() => {
		// @ts-expect-error
		getSymbol('');
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedString}`));

	end();
});

test('isSymbol', ({ end }) => {

	equal(isSymbol, symbol);

	notOk(isSymbol());
	ok(isSymbol(Symbol()));

	end();
});

test('parseSymbol', ({ end }) => {

	const s = Symbol();

	equal(parseSymbol(s), s);

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