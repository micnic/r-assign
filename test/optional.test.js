'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	isOptional,
	isOptionalUndefined,
	isString,
	optional,
	optionalUndef
} = require('r-assign/lib');

test('isOptional', ({ end }) => {

	const isOptionalString = isOptional(isString);

	equal(isOptional, optional);

	ok(isOptionalString(''));
	notOk(isOptionalString());
	notOk(isOptionalString(null));

	throws(() => {
		// @ts-expect-error
		isOptional();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isOptional(isOptional(isString));
	}, TypeError('Optional type cannot be wrapped in optional type'));

	end();
});

test('isOptionalUndefined', ({ end }) => {

	const isOptionalString = isOptionalUndefined(isString);

	equal(isOptionalUndefined, optionalUndef);

	ok(isOptionalString());
	ok(isOptionalString(''));
	notOk(isOptionalString(null));

	throws(() => {
		// @ts-expect-error
		isOptionalUndefined();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isOptionalUndefined(isOptionalUndefined(isString));
	}, TypeError('Optional type cannot be wrapped in optional type'));

	end();
});