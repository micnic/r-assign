import { test, equal, match, notSame, same, throws } from 'tap';
import rAssign, {
	isAny,
	isArrayOf,
	isFunction,
	isInstanceOf,
	isIntersectionOf,
	isLiteral,
	isNumber,
	isObjectOf,
	isOptional,
	isPromiseOf,
	isString,
	isTemplateLiteralOf,
	isTupleOf,
	isTupleRestOf,
	isUnionOf,
	parseType
} from 'r-assign';

const emptyArray = 'an empty array []';
const expected = 'expected a string value';
// eslint-disable-next-line no-template-curly-in-string
const expectedTL = 'expected a template literal of `a-${string}`';
const invalidReturn = 'Invalid function return';
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

test('rAssign + parseType', ({ end }) => {
	throws(() => {
		rAssign({
			a: parseType(isString)
		}, {
			a: new Date()
		});
	});

	end();
});

test('parseType: instanceof', ({ end }) => {

	const parseDate = parseType(isInstanceOf(Date));

	match(parseDate(new Date()), new Date());

	throws(() => {
		parseDate();
	});

	end();
});

test('parseType: literal', ({ end }) => {

	const parseLiteralA = parseType(isLiteral('a'));

	match(parseLiteralA('a'), 'a');

	throws(() => {
		parseLiteralA('b');
	});

	end();
});

test('parseType: tuple', ({ end }) => {

	const parseTuple = parseType(isTupleOf([isString, isNumber]));

	match(parseTuple(['a', 1]), ['a', 1]);

	throws(() => {
		parseTuple([]);
	});

	throws(() => {
		parseTuple(['a']);
	});

	throws(() => {
		parseTuple(['a', 'b']);
	});

	end();
});

test('parseType: {} & {}', ({ end }) => {

	const parseIntersection = parseType(isIntersectionOf([isObjectOf({
		a: isString
	}), isObjectOf({
		b: isString
	})]));

	match(parseIntersection({ a: 'a', b: 'b' }), { a: 'a', b: 'b' });

	throws(() => {
		parseIntersection({ a: 'a' });
	});

	end();
});

test('parseType: () => void', ({ end }) => {

	const parseFunction = parseType(isFunction([]));
	const f = parseFunction(() => null);

	equal(parseFunction(() => undefined)(), undefined);

	throws(() => {
		// @ts-expect-error
		f(null);
	}, TypeError('Invalid function arguments'));

	throws(() => {
		f();
	}, TypeError('Invalid function return, expected void'));

	end();
});

test('parseType: () => string', ({ end }) => {

	const parseFunction = parseType(isFunction([], isString));
	const f = parseFunction(() => null);

	equal(parseFunction(() => '')(), '');

	throws(() => {
		// @ts-expect-error
		f(null);
	}, TypeError('Invalid function arguments'));

	throws(() => {
		f();
	}, TypeError(`${invalidReturn}, ${expected} but received null`));

	end();
});

test('parseType: () => Promise<void>', async ({
	end,
	rejects,
	resolveMatch
}) => {
	const parseFunction = parseType(isFunction([], isPromiseOf()));
	const f = parseFunction(() => null);

	await resolveMatch(parseFunction(() => Promise.resolve())(), undefined);

	await rejects(parseFunction(() => Promise.resolve(''))());

	throws(() => {
		// @ts-expect-error
		f(null);
	});

	throws(() => {
		f();
	});

	end();
});

test('parseType: () => Promise<string>', async ({
	end,
	rejects,
	resolveMatch
}) => {
	const parseFunction = parseType(isFunction([], isPromiseOf(isString)));
	const f = parseFunction(() => null);

	await resolveMatch(parseFunction(() => Promise.resolve(''))(), '');

	await rejects(parseFunction(() => Promise.resolve())());

	throws(() => {
		// @ts-expect-error
		f(null);
	});

	throws(() => {
		f();
	});

	end();
});

test('parseType: Promise<void>', async ({ end, resolveMatch }) => {

	const parsePromise = parseType(isPromiseOf());

	await resolveMatch(parsePromise(Promise.resolve()), undefined);

	throws(() => {
		parsePromise();
	});

	end();
});

test('parseType: Promise<string>', async ({ end, resolveMatch }) => {

	const parsePromise = parseType(isPromiseOf(isString));

	await resolveMatch(parsePromise(Promise.resolve('')), '');

	throws(() => {
		parsePromise();
	});

	end();
});