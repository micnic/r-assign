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

const invalidDefaultValue = 'Invalid default value type';
const invalidValue = 'Invalid value type';
const expected = 'expected a tuple of [ string ]';
const received = 'but received a value of type [ number ]';

test('getTupleOf', ({ end }) => {

	const getTupleOfString = getTupleOf([isString], ['abc']);

	match(getTupleOfString(['abc']), ['abc']);
	match(getTupleOfString([]), ['abc']);

	throws(() => {
		getTupleOf([isString]);
	}, TypeError(`${invalidDefaultValue}, ${expected} but received undefined`));

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
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		isTupleOf([]);
	}, TypeError('Not enough type guards, at least one expected'));

	throws(() => {
		isTupleOf([null]);
	}, TypeError('Invalid type guard provided'));

	end();
});

test('parseTupleOf', ({ end }) => {

	const parseTupleOfString = parseTupleOf([isString]);

	match(parseTupleOfString(['abc']), ['abc']);

	throws(() => {
		parseTupleOfString([]);
	});

	throws(() => {
		parseTupleOfString([0]);
	}, TypeError(`${invalidValue}, ${expected} ${received}`));

	end();
});