'use strict';

const { test, equal, match, notSame, same, throws } = require('tap');
const {
	isAny,
	isArrayOf,
	isNumber,
	isObjectOf,
	isOptional,
	isString,
	isTemplateLiteralOf,
	isTupleOf,
	isTupleRestOf,
	isUnionOf,
	parseType
} = require('r-assign/lib');

const emptyArray = 'an empty array []';
const expected = 'expected a string value';
// eslint-disable-next-line no-template-curly-in-string
const expectedTL = 'expected a template literal of `a-${string}`';
const invalidValue = 'Invalid value type';
const nestedArray = 'a value of type [][]';
const receivedUndefined = 'but received undefined';

/**
 * Append dot to the provided string
 * @param {string} string
 * @returns {string}
 */
const appendDot = (string) => `${string}.`;

test('parseType', ({ end }) => {

	equal(parseType(isString)('abc'), 'abc');
	equal(parseType(isString, appendDot)('abc'), 'abc.');

	const any0 = { unreconized: true };

	same(parseType(isAny)(any0), any0);

	/** @type {[]} */
	const array0 = [];

	same(parseType(isArrayOf(isString))(array0), array0);

	const array1 = ['a', 'b', 'c'];

	same(parseType(isArrayOf(isString))(array1), array1);

	const array2 = ['a', 'b', { value: 'c' }];

	same(
		parseType(
			isArrayOf(isUnionOf([isObjectOf({ value: isString }), isString]))
		)(array2),
		array2
	);

	const array3 = ['a', 'b', { unreconized: true, value: 'c' }];

	notSame(
		parseType(
			isArrayOf(isUnionOf([isObjectOf({ value: isString }), isString]))
		)(array3),
		array3
	);

	match(
		parseType(
			isArrayOf(isUnionOf([isObjectOf({ value: isString }), isString]))
		)(array3),
		array2
	);

	const object0 = {};

	same(parseType(isObjectOf({}))(object0), object0);

	const object1 = {
		a: 'a',
		b: 'b',
		c: 'c'
	};

	same(
		parseType(isObjectOf({ a: isString, b: isString, c: isString }))(
			object1
		),
		object1
	);

	const object2 = {
		a: 'a',
		b: 'b',
		c: 'c',
		unrecognized: true
	};

	notSame(
		parseType(isObjectOf({ a: isString, b: isString, c: isString }))(
			object2
		),
		object2
	);

	match(
		parseType(isObjectOf({ a: isString, b: isString, c: isString }))(
			object2
		),
		object1
	);

	const object3 = {
		a: 'a',
		b: 'b',
		c: { value: 'c' }
	};

	same(
		parseType(
			isObjectOf({
				a: isString,
				b: isString,
				c: isUnionOf([isObjectOf({ value: isString }), isString])
			})
		)(object3),
		object3
	);

	const object4 = {
		a: 'a',
		b: 'b',
		c: { unreconized: true, value: 'c' }
	};

	notSame(
		parseType(
			isObjectOf({
				a: isString,
				b: isString,
				c: isUnionOf([isObjectOf({ value: isString }), isString])
			})
		)(object4),
		object4
	);

	match(
		parseType(
			isObjectOf({
				a: isString,
				b: isString,
				c: isUnionOf([isObjectOf({ value: isString }), isString])
			})
		)(object4),
		object3
	);

	/** @type {[]} */
	const tuple0 = [];

	same(parseType(isTupleOf([]))(tuple0), tuple0);

	const tuple1 = ['a', 'b', 'c'];

	same(parseType(isTupleOf([isString, isString, isString]))(tuple1), tuple1);

	const tuple2 = ['a', 'b', { value: 'c' }];

	same(
		parseType(
			isTupleOf([isString, isString, isObjectOf({ value: isString })])
		)(tuple2),
		tuple2
	);

	const tuple3 = ['a', 'b', { unreconized: true, value: 'c' }];

	notSame(
		parseType(
			isTupleOf([isString, isString, isObjectOf({ value: isString })])
		)(tuple3),
		tuple3
	);

	match(
		parseType(
			isTupleOf([isString, isString, isObjectOf({ value: isString })])
		)(tuple3),
		tuple2
	);

	const tuple4 = ['a', 'b', 'c', 'd', { value: 'e' }];

	same(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isString),
				isObjectOf({ value: isString })
			])
		)(tuple4),
		tuple4
	);

	const tuple5 = ['a', 'b', 'c', 'd', { unreconized: true, value: 'e' }];

	notSame(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isString),
				isObjectOf({ value: isString })
			])
		)(tuple5),
		tuple5
	);

	match(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isString),
				isObjectOf({ value: isString })
			])
		)(tuple5),
		tuple4
	);

	const tuple6 = ['a', 'b', 'c', { value: 'd' }, { value: 'e' }];

	same(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isString),
				isObjectOf({ value: isString }),
				isObjectOf({ value: isString })
			])
		)(tuple6),
		tuple6
	);

	const tuple7 = [
		'a',
		'b',
		'c',
		{ value: 'd' },
		{ unreconized: true, value: 'e' }
	];

	notSame(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isString),
				isObjectOf({ value: isString }),
				isObjectOf({ value: isString })
			])
		)(tuple7),
		tuple7
	);

	match(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isString),
				isObjectOf({ value: isString }),
				isObjectOf({ value: isString })
			])
		)(tuple7),
		tuple6
	);

	const tuple8 = ['a', { value: 'b' }, { value: 'c' }, { value: 'd' }, 'e'];

	same(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isObjectOf({ value: isString })),
				isString
			])
		)(tuple8),
		tuple8
	);

	const tuple9 = [
		'a',
		{ value: 'b' },
		{ unreconized: true, value: 'c' },
		{ value: 'd' },
		'e'
	];

	notSame(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isObjectOf({ value: isString })),
				isString
			])
		)(tuple9),
		tuple9
	);

	match(
		parseType(
			isTupleOf([
				isString,
				isTupleRestOf(isObjectOf({ value: isString })),
				isString
			])
		)(tuple9),
		tuple8
	);

	throws(() => {
		// @ts-expect-error
		parseType();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		parseType(isString)();
	}, TypeError(`${invalidValue}, ${expected} ${receivedUndefined}`));

	throws(() => {
		parseType(isString)([]);
	}, TypeError(`${invalidValue}, ${expected} but received ${emptyArray}`));

	throws(() => {
		parseType(isString)([[]]);
	}, TypeError(`${invalidValue}, ${expected} but received ${nestedArray}`));

	throws(() => {
		// @ts-expect-error
		parseType(isOptional(isString));
	}, TypeError('Invalid use of optional type'));

	throws(() => {
		parseType(isTemplateLiteralOf(['a-', isString]))('');
	}, TypeError(`${invalidValue}, ${expectedTL} but received ""`));

	throws(() => {
		// @ts-expect-error
		parseType(isNumber, appendDot)(0);
	});

	end();
});