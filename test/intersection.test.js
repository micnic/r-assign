'use strict';

const { test, equal, match, notOk, ok, throws } = require('tap');
const {
	getIntersectionOf,
	intersection,
	isAny,
	isArrayOf,
	isFunction,
	isInstanceOf,
	isIntersectionOf,
	isLiteral,
	isLiteralOf,
	isNumber,
	isObjectOf,
	isOptional,
	isOptionalUndefined,
	isRecordOf,
	isStrictObjectOf,
	isString,
	isTemplateLiteralOf,
	isTupleOf,
	parseIntersectionOf
} = require('r-assign/lib');

test('getIntersectionOf', ({ end }) => {

	const getIntersectionOfNumberString = getIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})], { number: 0, string: '' });

	match(getIntersectionOfNumberString(), { number: 0, string: '' });
	match(getIntersectionOfNumberString(null), { number: 0, string: '' });
	match(getIntersectionOfNumberString({
		number: 1
	}), { number: 0, string: '' });
	match(getIntersectionOfNumberString({
		number: 1,
		string: 'data'
	}), { number: 1, string: 'data' });

	throws(() => {
		getIntersectionOf([isObjectOf({
			number: isNumber
		}), isObjectOf({
			string: isString
		})], null);
	});

	end();
});

test('isIntersectionOf', ({ end }) => {

	equal(isIntersectionOf, intersection);

	ok(isIntersectionOf([isArrayOf(isString), isArrayOf(isString)])(['']));
	notOk(isIntersectionOf([isArrayOf(isString), isArrayOf(isString)])([0]));

	ok(isIntersectionOf([isArrayOf(isString), isTupleOf([isString])])(['']));
	notOk(
		isIntersectionOf([isArrayOf(isString), isTupleOf([isString])])(['', ''])
	);

	ok(
		isIntersectionOf([isFunction([]), isFunction([isString])])(
			() => undefined
		)
	);
	ok(
		isIntersectionOf([
			isFunction([isString]),
			isFunction([isString, isString])
		])(() => undefined)
	);
	ok(
		isIntersectionOf([
			isFunction([isString, isString]),
			isFunction([isString])
		])(() => undefined)
	);
	ok(
		isIntersectionOf([isFunction([]), isFunction([isString], isString)])(
			() => undefined
		)
	);
	ok(
		isIntersectionOf([isFunction([isString], isString), isFunction([])])(
			() => undefined
		)
	);
	ok(
		isIntersectionOf([
			isFunction([isString], isString),
			isFunction([], isString)
		])(() => undefined)
	);

	ok(isIntersectionOf([isLiteral('a'), isLiteral('a')])('a'));
	notOk(isIntersectionOf([isLiteral('a'), isLiteral('a')])('b'));

	ok(isIntersectionOf([isLiteral('a'), isLiteralOf(['a', 'b'])])('a'));
	notOk(isIntersectionOf([isLiteral('a'), isLiteralOf(['a', 'b'])])('b'));

	ok(isIntersectionOf([isLiteral('a'), isString])('a'));
	notOk(isIntersectionOf([isLiteral('a'), isString])('b'));

	ok(
		isIntersectionOf([isLiteral('0'), isTemplateLiteralOf([isNumber])])('0')
	);
	notOk(
		isIntersectionOf([isLiteral('0'), isTemplateLiteralOf([isNumber])])('a')
	);

	ok(isIntersectionOf([isLiteralOf(['a', 'b']), isLiteral('a')])('a'));
	notOk(isIntersectionOf([isLiteralOf(['a', 'b']), isLiteral('a')])('b'));

	ok(
		isIntersectionOf([isLiteralOf(['a', 'b']), isLiteralOf(['a', 'b'])])(
			'a'
		)
	);
	ok(
		isIntersectionOf([isLiteralOf(['a', 'b']), isLiteralOf(['a', 'b'])])(
			'b'
		)
	);
	notOk(
		isIntersectionOf([isLiteralOf(['a', 'b']), isLiteralOf(['a', 'b'])])(
			'c'
		)
	);

	ok(isIntersectionOf([isLiteralOf(['a', 'b']), isString])('a'));
	ok(isIntersectionOf([isLiteralOf(['a', 'b']), isString])('b'));
	notOk(isIntersectionOf([isLiteralOf(['a', 'b']), isString])('c'));

	ok(isIntersectionOf([isLiteralOf(['a', 'b', 1]), isString])('a'));
	ok(isIntersectionOf([isLiteralOf(['a', 'b', 1]), isString])('b'));
	notOk(isIntersectionOf([isLiteralOf(['a', 'b', 1]), isString])(1));

	ok(isIntersectionOf([isLiteralOf(['a', 1]), isString])('a'));
	notOk(isIntersectionOf([isLiteralOf(['a', 1]), isString])(1));

	ok(
		isIntersectionOf([
			isLiteralOf(['0', '1']),
			isTemplateLiteralOf([isNumber])
		])('0')
	);
	ok(
		isIntersectionOf([
			isLiteralOf(['0', '1']),
			isTemplateLiteralOf([isNumber])
		])('1')
	);
	notOk(
		isIntersectionOf([
			isLiteralOf(['0', '1']),
			isTemplateLiteralOf([isNumber])
		])('2')
	);

	ok(isIntersectionOf([isObjectOf({
		a: isNumber,
		b: isLiteral(''),
		c: isOptional(isString),
		d: isOptionalUndefined(isString),
		e: isOptional(isString),
		f: isString
	}), isObjectOf({
		b: isString,
		c: isOptional(isString),
		d: isOptionalUndefined(isString),
		e: isString,
		f: isOptional(isString)
	})])({ a: 0, b: '', e: '', f: '' }));

	ok(
		isIntersectionOf([
			isRecordOf(isString, isString),
			isRecordOf(isString, isString)
		])({ a: 'a' })
	);
	notOk(
		isIntersectionOf([
			isRecordOf(isString, isString),
			isRecordOf(isString, isString)
		])({ a: 1 })
	);

	ok(isIntersectionOf([isString, isLiteral('a')])('a'));
	notOk(isIntersectionOf([isString, isLiteral('a')])('b'));

	ok(isIntersectionOf([isString, isLiteralOf(['a', 'b'])])('a'));
	ok(isIntersectionOf([isString, isLiteralOf(['a', 'b'])])('b'));
	notOk(isIntersectionOf([isString, isLiteralOf(['a', 'b'])])('c'));

	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isNumber]),
			isLiteralOf(['0', '1'])
		])('0')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isNumber]),
			isLiteralOf(['0', '1'])
		])('1')
	);
	notOk(
		isIntersectionOf([
			isTemplateLiteralOf([isNumber]),
			isLiteralOf(['0', '1'])
		])('2')
	);

	ok(isIntersectionOf([isTemplateLiteralOf([isNumber]), isString])('0'));
	notOk(isIntersectionOf([isTemplateLiteralOf([isNumber]), isString])('a'));

	ok(
		isIntersectionOf([
			isTemplateLiteralOf(['-', isString]),
			isTemplateLiteralOf(['-', isString])
		])('-a')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf(['-', isString]),
			isTemplateLiteralOf(['-', isString])
		])('-')
	);
	notOk(
		isIntersectionOf([
			isTemplateLiteralOf(['-', isString]),
			isTemplateLiteralOf(['-', isString])
		])('a')
	);
	throws(() => {
		isIntersectionOf([
			isTemplateLiteralOf(['-', isString]),
			isTemplateLiteralOf(['+', isString])
		]);
	});

	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '-'])
		])('a-')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '-'])
		])('-')
	);
	notOk(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '-'])
		])('a')
	);
	throws(() => {
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '+'])
		]);
	});

	ok(
		isIntersectionOf([
			isTemplateLiteralOf(['-', isString]),
			isTemplateLiteralOf(['-+', isString])
		])('-+a')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf(['-', isString]),
			isTemplateLiteralOf(['-+', isString])
		])('-+')
	);
	notOk(
		isIntersectionOf([
			isTemplateLiteralOf(['-', isString]),
			isTemplateLiteralOf(['-+', isString])
		])('-a')
	);

	ok(
		isIntersectionOf([
			isTemplateLiteralOf(['-+', isString]),
			isTemplateLiteralOf(['-', isString])
		])('-+a')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf(['-+', isString]),
			isTemplateLiteralOf(['-', isString])
		])('-+')
	);
	notOk(
		isIntersectionOf([
			isTemplateLiteralOf(['-+', isString]),
			isTemplateLiteralOf(['-', isString])
		])('-a')
	);

	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '+-'])
		])('a+-')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '+-'])
		])('+-')
	);
	notOk(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '+-'])
		])('a-')
	);

	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '+-']),
			isTemplateLiteralOf([isString, '-'])
		])('a+-')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '+-']),
			isTemplateLiteralOf([isString, '-'])
		])('+-')
	);
	notOk(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '+-']),
			isTemplateLiteralOf([isString, '-'])
		])('a-')
	);

	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-', isString]),
			isTemplateLiteralOf([isString, '+-+'])
		])('a+-+')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-', isString]),
			isTemplateLiteralOf([isString, '+-+'])
		])('+-+')
	);
	throws(() => {
		isIntersectionOf([
			isTemplateLiteralOf([isString, '-']),
			isTemplateLiteralOf([isString, '+-+'])
		])('a+-+');
	});

	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '+-+']),
			isTemplateLiteralOf([isString, '-', isString])
		])('a+-+')
	);
	ok(
		isIntersectionOf([
			isTemplateLiteralOf([isString, '+-+']),
			isTemplateLiteralOf([isString, '-', isString])
		])('+-+')
	);
	throws(() => {
		isIntersectionOf([
			isTemplateLiteralOf([isString, '+-+']),
			isTemplateLiteralOf([isString, '-'])
		])('a+-+');
	});

	ok(isIntersectionOf([isTupleOf([isString]), isArrayOf(isString)])(['']));
	notOk(
		isIntersectionOf([isTupleOf([isString]), isArrayOf(isString)])(['', ''])
	);

	ok(isIntersectionOf([isTupleOf([isString]), isTupleOf([isString])])(['']));
	notOk(
		isIntersectionOf([isTupleOf([isString]), isTupleOf([isString])])([
			'',
			''
		])
	);

	ok(
		isIntersectionOf([
			isTupleOf([isString]),
			isTupleOf([isOptional(isString)])
		])([''])
	);
	notOk(
		isIntersectionOf([
			isTupleOf([isString]),
			isTupleOf([isOptional(isString)])
		])([])
	);

	ok(
		isIntersectionOf([
			isTupleOf([isOptional(isString)]),
			isTupleOf([isString])
		])([''])
	);
	notOk(
		isIntersectionOf([
			isTupleOf([isOptional(isString)]),
			isTupleOf([isString])
		])([])
	);

	ok(
		isIntersectionOf([
			isTupleOf([isOptional(isString)]),
			isTupleOf([isOptional(isString)])
		])([''])
	);
	ok(
		isIntersectionOf([
			isTupleOf([isOptional(isString)]),
			isTupleOf([isOptional(isString)])
		])([])
	);
	notOk(
		isIntersectionOf([
			isTupleOf([isOptional(isString)]),
			isTupleOf([isOptional(isString)])
		])(['', ''])
	);

	ok(
		isIntersectionOf([
			isTupleOf([isOptionalUndefined(isString)]),
			isTupleOf([isOptionalUndefined(isString)])
		])([''])
	);
	ok(
		isIntersectionOf([
			isTupleOf([isOptionalUndefined(isString)]),
			isTupleOf([isOptionalUndefined(isString)])
		])([])
	);
	ok(
		isIntersectionOf([
			isTupleOf([isOptionalUndefined(isString)]),
			isTupleOf([isOptionalUndefined(isString)])
		])([undefined])
	);
	notOk(
		isIntersectionOf([
			isTupleOf([isOptionalUndefined(isString)]),
			isTupleOf([isOptionalUndefined(isString)])
		])(['', ''])
	);
	notOk(
		isIntersectionOf([
			isTupleOf([isOptionalUndefined(isString)]),
			isTupleOf([isOptionalUndefined(isString)])
		])([undefined, undefined])
	);

	throws(() => {
		// @ts-expect-error
		isIntersectionOf();
	});

	throws(() => {
		// @ts-expect-error
		isIntersectionOf([]);
	});

	throws(() => {
		// @ts-expect-error
		isIntersectionOf([null, null]);
	});

	throws(() => {
		isIntersectionOf([isAny, isString]);
	});

	throws(() => {
		isIntersectionOf([isFunction([]), isString]);
	});

	throws(() => {
		isIntersectionOf([isInstanceOf(String), isString]);
	});

	throws(() => {
		isIntersectionOf([isLiteral('a'), isLiteral('b')]);
	});

	throws(() => {
		isIntersectionOf([isLiteral('a'), isArrayOf(isString)]);
	});

	throws(() => {
		isIntersectionOf([isLiteral(0), isString]);
	});

	throws(() => {
		isIntersectionOf([isLiteral('a'), isLiteralOf([0, 1])]);
	});

	throws(() => {
		isIntersectionOf([isLiteralOf([0, 1]), isString]);
	});

	throws(() => {
		isIntersectionOf([isLiteralOf([0, 1]), isArrayOf(isString)]);
	});

	throws(() => {
		isIntersectionOf([isNumber, isString]);
	});

	throws(() => {
		isIntersectionOf([isObjectOf({}), isString]);
	});

	throws(() => {
		isIntersectionOf([isOptional(isNumber), isString]);
	});

	throws(() => {
		isIntersectionOf([isArrayOf(isString), isString]);
	});

	throws(() => {
		isIntersectionOf([isRecordOf(isString, isString), isString]);
	});

	throws(() => {
		isIntersectionOf([isString, isArrayOf(isString)]);
	});

	throws(() => {
		isIntersectionOf([isStrictObjectOf({}), isStrictObjectOf({})]);
	});

	throws(() => {
		isIntersectionOf([
			isTemplateLiteralOf([isNumber]),
			isArrayOf(isString)
		]);
	});

	throws(() => {
		isIntersectionOf([isTemplateLiteralOf([isNumber]), isLiteral('a')]);
	});

	throws(() => {
		isIntersectionOf([isTemplateLiteralOf([isNumber]), isNumber]);
	});

	throws(() => {
		isIntersectionOf([isTupleOf([isString]), isString]);
	});

	throws(() => {
		isIntersectionOf([isTupleOf([]), isTupleOf([isString])]);
	});

	end();
});

test('parseIntersectionOf', ({ end }) => {

	const parseIntersectionOfNumberString = parseIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})]);

	match(parseIntersectionOfNumberString({
		number: 1,
		string: 'data'
	}), {
		number: 1,
		string: 'data'
	});

	throws(() => {
		parseIntersectionOfNumberString(null);
	});

	end();
});