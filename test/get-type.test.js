import { test, equal, match, throws } from 'tap';
import {
	getType,
	isArrayOf,
	isBoolean,
	isFunction,
	isIntersectionOf,
	isNumber,
	isObjectOf,
	isOptional,
	isPromiseOf,
	isString,
	isTupleOf,
	isUnionOf
} from 'r-assign';

const expected = 'expected a string value';
const invalidDefaultValue = 'Invalid default value type';
const invalidReturn = 'Invalid function return';
const receivedArray = 'but received a value of type string[]';

/**
 * Append dot to the provided string
 * @param {string} string
 * @returns {string}
 */
const appendDot = (string) => `${string}.`;

test('getType', ({ end }) => {

	const getString = getType(isString, '');

	equal(getString('abc'), 'abc');
	equal(getString(), '');

	const getStringWithDot = getType(isString, '', appendDot);

	equal(getStringWithDot('abc'), 'abc.');
	equal(getStringWithDot(), '.');

	const getStringTuple = getType(isTupleOf([isString]), ['']);

	match(getStringTuple(['abc']), ['abc']);
	match(getStringTuple(), ['']);

	const getStringArray = getType(isArrayOf(isString), []);

	match(getStringArray(['abc']), ['abc']);
	match(getStringArray(), []);

	const getStringOrNumber = getType(isUnionOf([isString, isNumber]), '');

	equal(getStringOrNumber('abc'), 'abc');
	equal(getStringOrNumber(0), 0);
	equal(getStringOrNumber(), '');

	const getIntersectBNS = getType(isIntersectionOf([
		isUnionOf([isBoolean, isNumber]),
		isUnionOf([isNumber, isString])
	]), 0);

	equal(getIntersectBNS(1), 1);
	equal(getIntersectBNS(), 0);

	match(
		getType(
			isIntersectionOf([isFunction([isString]), isFunction([isNumber])]),
			() => { /* Noop */ }
		)(),
		() => { /* Noop */ }
	);

	const getObjectOfString = getType(isObjectOf({
		a: isOptional(isString)
	}), {});

	match(getObjectOfString({ a: 'abc' }), { a: 'abc' });
	match(getObjectOfString({ a: 'abc', b: 'def' }), { a: 'abc' });
	match(getObjectOfString({ a: 0 }), {});
	match(getObjectOfString({}), {});
	match(getObjectOfString(), {});

	throws(() => {
		// @ts-expect-error
		getType();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		getType(isString, ['a', 'b']);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${receivedArray}`));

	throws(() => {
		// @ts-expect-error
		getType(isOptional(isString), '');
	}, TypeError('Invalid use of optional type'));

	throws(() => {
		// @ts-expect-error
		getType(isString);
	}, TypeError(`${invalidDefaultValue}, ${expected} but received undefined`));

	end();
});

test('getType: () => void', ({ end }) => {

	const getFunction = getType(isFunction([]), () => null);
	const f = getFunction();

	equal(getFunction(() => undefined)(), undefined);

	throws(() => {
		// @ts-expect-error
		f(null);
	}, TypeError('Invalid function arguments'));

	throws(() => {
		f();
	}, TypeError('Invalid function return, expected void'));

	end();
});

test('getType: () => string', ({ end }) => {

	// @ts-expect-error
	const getFunction = getType(isFunction([], isString), () => null);
	const f = getFunction();

	equal(getFunction(() => '')(), '');

	throws(() => {
		// @ts-expect-error
		f(null);
	}, TypeError('Invalid function arguments'));

	throws(() => {
		f();
	}, TypeError(`${invalidReturn}, ${expected} but received null`));

	end();
});

test('getType: Promise<void>', async ({ end, rejects, resolveMatch }) => {

	// @ts-expect-error
	const getPromise = getType(isPromiseOf(), Promise.resolve(null));

	await resolveMatch(getPromise(Promise.resolve()), undefined);

	await rejects(() => getPromise());

	end();
});

test('getType: Promise<string>', async ({ end, rejects, resolveMatch }) => {

	// @ts-expect-error
	const getPromise = getType(isPromiseOf(isString), Promise.resolve(null));

	await resolveMatch(getPromise(Promise.resolve('')), '');

	await rejects(() => getPromise());

	end();
});