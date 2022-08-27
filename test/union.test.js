'use strict';

const { test, equal, match, notOk, ok, throws } = require('tap');
const {
	getUnionOf,
	isAny,
	isArrayOf,
	isBoolean,
	isLiteral,
	isLiteralOf,
	isNumber,
	isObjectOf,
	isOptional,
	isString,
	isTemplateLiteralOf,
	isUnionOf,
	parseUnionOf,
	union
} = require('r-assign/lib');

const expected = 'expected an union of string | number';
const invalidDefaultValue = 'Invalid default value type';
const invalidOptionalType = 'Optional type cannot be used in union declaration';
const invalidValue = 'Invalid value type';

test('getUnionOf', ({ end }) => {

	const getStringOrNumber = getUnionOf([isString, isNumber], '');

	equal(getStringOrNumber(), '');
	equal(getStringOrNumber(0), 0);
	equal(getStringOrNumber(1), 1);
	equal(getStringOrNumber(''), '');
	equal(getStringOrNumber('data'), 'data');

	match(
		getUnionOf(
			[isObjectOf({ prop: isString }), isObjectOf({ prop: isNumber })],
			{ prop: 'data' }
		)(),
		{ prop: 'data' }
	);
	match(
		getUnionOf(
			[isObjectOf({ prop: isString }), isObjectOf({ prop: isNumber })],
			{ prop: 'data' }
		)({ prop: 'prop' }),
		{ prop: 'prop' }
	);

	throws(() => {
		// @ts-expect-error
		getUnionOf([isString, isNumber], null);
	}, TypeError(`${invalidDefaultValue}, ${expected} but received null`));

	end();
});

test('isUnionOf', ({ end }) => {

	equal(isUnionOf, union);

	ok(isUnionOf([isBoolean, isNumber, isAny])(''));
	ok(isUnionOf([isBoolean, isNumber])(true));
	ok(isUnionOf([isBoolean, isNumber])(0));
	ok(isUnionOf([isLiteral('a'), isString])(''));
	ok(isUnionOf([isLiteral('a'), isLiteralOf(['a', 'b'])])('a'));
	ok(isUnionOf([isLiteralOf(['a', 0, 1]), isString])('a'));
	ok(isUnionOf([isLiteralOf(['a', 0]), isString])('a'));
	ok(isUnionOf([isTemplateLiteralOf([isNumber]), isString])(''));

	// TODO: add a check for equivalent types
	ok(isUnionOf([isArrayOf(isBoolean), isArrayOf(isBoolean)])([true]));

	notOk(isUnionOf([isBoolean, isNumber])(''));

	const isBooleanOrNumberOrString = isUnionOf([
		isBoolean,
		isUnionOf([isNumber, isString])
	]);

	ok(isBooleanOrNumberOrString(true));
	ok(isBooleanOrNumberOrString(0));
	ok(isBooleanOrNumberOrString(''));
	notOk(isBooleanOrNumberOrString());

	equal(isUnionOf([isBoolean, isBoolean]), isBoolean);

	throws(() => {
		// @ts-expect-error
		isUnionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		// @ts-expect-error
		isUnionOf([]);
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		// @ts-expect-error
		isUnionOf(Array(1 + 1));
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		// @ts-expect-error
		isUnionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isUnionOf([isOptional(isString), isString]);
	}, TypeError(invalidOptionalType));

	end();
});

test('parseUnionOf', ({ end }) => {

	const parseStringOrNumber = parseUnionOf([isString, isNumber]);

	equal(parseStringOrNumber(''), '');

	throws(() => {
		parseStringOrNumber(null);
	}, TypeError(`${invalidValue}, ${expected} but received null`));

	end();
});