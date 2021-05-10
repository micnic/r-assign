'use strict';

const { test, match, notOk, ok, throws } = require('tap');
const {
	getTupleOf,
	isTupleOf,
	parseTupleOf
} = require('r-assign/lib/tuple');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isOptional } = require('r-assign/lib/optional');
const { isString } = require('r-assign/lib/string');

test('getTupleOf', ({ end }) => {

	const getTupleOfString = getTupleOf([isString], ['abc']);

	match(getTupleOfString(['abc']), ['abc']);
	match(getTupleOfString([]), ['abc']);

	throws(() => {
		getTupleOf([isString]);
	});

	end();
});

test('isTupleOf', ({ end }) => {

	const isTupleOfString = isTupleOf([isString]);

	ok(isTupleOfString(['abc']));
	notOk(isTupleOfString([]));

	const isTupleOfOptionalValue = isTupleOf([
		isOptional(isString)
	]);

	ok(isTupleOfOptionalValue([]));
	ok(isTupleOfOptionalValue(['abc']));
	notOk(isTupleOfOptionalValue([null]));

	const isTupleOfMultipleOptionalValues = isTupleOf([
		isOptional(isBoolean),
		isOptional(isNumber),
		isOptional(isString)
	]);

	ok(isTupleOfMultipleOptionalValues([]));
	ok(isTupleOfMultipleOptionalValues([true]));
	ok(isTupleOfMultipleOptionalValues([true, 1]));
	ok(isTupleOfMultipleOptionalValues([true, 1, 'abc']));
	notOk(isTupleOfMultipleOptionalValues([1]));

	const isTupleOfMixedValues = isTupleOf([
		isString,
		isOptional(isString)
	]);

	ok(isTupleOfMixedValues(['abc']));
	ok(isTupleOfMixedValues(['abc', 'def']));
	notOk(isTupleOfMixedValues([]));

	const isTupleOfMixedValuesOptionalFirst = isTupleOf([
		isOptional(isString),
		isString
	]);

	ok(isTupleOfMixedValuesOptionalFirst([((_) => _)(), 'def']));
	ok(isTupleOfMixedValuesOptionalFirst(['abc', 'def']));
	notOk(isTupleOfMixedValuesOptionalFirst([]));

	throws(() => {
		isTupleOf();
	});

	throws(() => {
		isTupleOf([]);
	});

	throws(() => {
		isTupleOf([null]);
	});

	throws(() => {
		isTupleOf([() => null]);
	});

	end();
});

test('parseTupleOf', ({ end }) => {

	const parseTupleOfString = parseTupleOf([isString]);

	match(parseTupleOfString(['abc']), ['abc']);

	throws(() => {
		parseTupleOfString([]);
	});

	end();
});