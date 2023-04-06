import { test, equal, notOk, ok, throws } from 'tap';
import {
	isKeyOf,
	isObjectOf,
	isOmitFrom,
	isOptional,
	isOptionalUndefined,
	isPickFrom,
	isString,
	keyof,
	object,
	omit,
	pick
} from 'r-assign';

const expectedKeys = 'expected strings or array of strings';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidShape = 'Invalid shape provided';

test('isKeyOf', ({ end }) => {
	equal(isKeyOf, keyof);

	ok(isKeyOf(isObjectOf({ abc: isString }))('abc'));
	notOk(isKeyOf(isObjectOf({ abc: isString }))('def'));
	notOk(isKeyOf(isObjectOf({}))('abc'));

	throws(() => {
		// @ts-expect-error
		isKeyOf(isString);
	}, TypeError('Invalid type provided, expected an object type'));

	end();
});

test('isObjectOf', ({ end }) => {

	equal(isObjectOf, object);

	ok(isObjectOf({})({}));
	ok(isObjectOf({ a: isString })({ a: 'abc' }));
	ok(isObjectOf({ a: isString })({ a: 'abc', b: 'def' }));
	ok(isObjectOf({ a: isOptional(isString) })({ a: 'abc' }));
	ok(isObjectOf({ a: isOptional(isString) })({}));
	notOk(isObjectOf({ a: isOptional(isString) })({ a: undefined }));

	ok(isObjectOf({ a: isOptionalUndefined(isString) })({ a: 'abc' }));
	ok(isObjectOf({ a: isOptionalUndefined(isString) })({ a: undefined }));
	ok(isObjectOf({ a: isOptionalUndefined(isString) })({}));
	notOk(isObjectOf({ a: isOptionalUndefined(isString) })({ a: null }));

	throws(() => {
		// @ts-expect-error
		isObjectOf();
	}, TypeError(invalidShape));

	throws(() => {
		// @ts-expect-error
		isObjectOf(null);
	}, TypeError(invalidShape));

	end();
});

test('isOmitFrom', ({ end }) => {

	equal(isOmitFrom, omit);

	ok(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			'abc'
		)({
			def: 'def',
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			'abc'
		)({
			abc: 'abc',
			def: 'def'
		})
	);
	ok(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			'abc'
		)({
			def: 'def',
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			'abc'
		)({
			abc: 'abc',
			def: 'def'
		})
	);

	ok(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			['abc', 'def']
		)({
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			['abc', 'def']
		)({
			abc: 'abc'
		})
	);
	ok(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			['abc', 'def']
		)({
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			['abc', 'def']
		)({
			abc: 'abc'
		})
	);

	throws(() => {
		// @ts-expect-error
		isOmitFrom(isString);
	}, TypeError('Invalid type provided, expected an object type'));

	throws(() => {
		// @ts-expect-error
		isOmitFrom(isObjectOf({ abc: isString }));
	}, TypeError(invalidKeysType));

	throws(() => {
		// @ts-expect-error
		isOmitFrom(isObjectOf({ abc: isString }), [0]);
	}, TypeError(invalidKeysType));

	end();
});

test('isPickFrom', ({ end }) => {

	equal(isPickFrom, pick);

	ok(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			'abc'
		)({
			abc: 'abc'
		})
	);
	notOk(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			'abc'
		)({
			def: 'def'
		})
	);
	ok(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			'abc'
		)({
			abc: 'abc'
		})
	);
	notOk(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			'abc'
		)({
			def: 'def'
		})
	);

	ok(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			['abc', 'def']
		)({
			abc: 'abc',
			def: 'def'
		})
	);
	notOk(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }),
			['abc', 'def']
		)({
			abc: 'abc'
		})
	);
	ok(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			['abc', 'def']
		)({
			abc: 'abc',
			def: 'def'
		})
	);
	notOk(
		isPickFrom(
			isObjectOf({ abc: isString, def: isString, ghi: isString }, true),
			['abc', 'def']
		)({
			abc: 'abc'
		})
	);

	throws(() => {
		// @ts-expect-error
		isPickFrom(isString);
	}, TypeError('Invalid type provided, expected an object type'));

	throws(() => {
		// @ts-expect-error
		isPickFrom(isObjectOf({ abc: isString }));
	}, TypeError(invalidKeysType));

	throws(() => {
		// @ts-expect-error
		isPickFrom(isObjectOf({ abc: isString }), [0]);
	}, TypeError(invalidKeysType));

	end();
});