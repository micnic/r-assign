'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	isObjectOf,
	isOptional,
	isOptionalUndefined,
	isPartial,
	isPartialUndefined,
	isStrictObjectOf,
	isString,
	isTupleOf,
	partial,
	partialUndef
} = require('r-assign/lib');

test('isPartial', ({ end }) => {

	equal(isPartial, partial);

	ok(isPartial(isObjectOf({ a: isString }))({}));
	ok(isPartial(isObjectOf({ a: isOptional(isString) }))({}));
	ok(isPartial(isObjectOf({ a: isOptionalUndefined(isString) }))({}));
	ok(isPartial(isObjectOf({ a: isString }))({ a: 'abc' }));
	ok(isPartial(isObjectOf({ a: isString }))({ a: 'abc', b: 'def' }));
	ok(isPartial(isObjectOf({ a: isString }))({ b: 'def' }));
	notOk(isPartial(isObjectOf({ a: isString }))({ a: undefined }));

	ok(isPartial(isStrictObjectOf({ a: isString }))({}));
	ok(isPartial(isStrictObjectOf({ a: isOptional(isString) }))({}));
	ok(isPartial(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({}));
	ok(isPartial(isStrictObjectOf({ a: isString }))({ a: 'abc' }));
	notOk(isPartial(isStrictObjectOf({ a: isString }))({ a: 'abc', b: 'def' }));
	notOk(isPartial(isStrictObjectOf({ a: isString }))({ b: 'def' }));
	notOk(isPartial(isStrictObjectOf({ a: isString }))({ a: undefined }));

	ok(isPartial(isTupleOf([isString]))([]));
	ok(isPartial(isTupleOf([isOptional(isString)]))([]));
	ok(isPartial(isTupleOf([isOptionalUndefined(isString)]))([]));
	ok(isPartial(isTupleOf([isString]))(['abc']));
	notOk(isPartial(isTupleOf([isString]))([undefined]));

	throws(() => {
		// @ts-expect-error
		isPartial();
	}, TypeError);

	throws(() => {
		// @ts-expect-error
		isPartial(isString);
	}, TypeError);

	end();
});

test('isPartialUndefined', ({ end }) => {

	equal(isPartialUndefined, partialUndef);

	ok(isPartialUndefined(isObjectOf({ a: isString }))({}));
	ok(isPartialUndefined(isObjectOf({ a: isOptional(isString) }))({}));
	ok(
		isPartialUndefined(isObjectOf({ a: isOptionalUndefined(isString) }))({})
	);
	ok(isPartialUndefined(isObjectOf({ a: isString }))({ a: 'abc' }));
	ok(isPartialUndefined(isObjectOf({ a: isString }))({ a: 'abc', b: 'def' }));
	ok(isPartialUndefined(isObjectOf({ a: isString }))({ b: 'def' }));
	ok(isPartialUndefined(isObjectOf({ a: isString }))({ a: undefined }));

	ok(isPartialUndefined(isStrictObjectOf({ a: isString }))({}));
	ok(isPartialUndefined(isStrictObjectOf({ a: isOptional(isString) }))({}));
	ok(
		isPartialUndefined(
			isStrictObjectOf({ a: isOptionalUndefined(isString) })
		)({})
	);
	ok(isPartialUndefined(isStrictObjectOf({ a: isString }))({ a: 'abc' }));
	ok(isPartialUndefined(isStrictObjectOf({ a: isString }))({ a: undefined }));
	notOk(
		isPartialUndefined(isStrictObjectOf({ a: isString }))({
			a: 'abc',
			b: 'def'
		})
	);
	notOk(isPartialUndefined(isStrictObjectOf({ a: isString }))({ b: 'def' }));

	ok(isPartialUndefined(isTupleOf([isString]))([]));
	ok(isPartialUndefined(isTupleOf([isOptional(isString)]))([]));
	ok(isPartialUndefined(isTupleOf([isOptionalUndefined(isString)]))([]));
	ok(isPartialUndefined(isTupleOf([isString]))(['abc']));
	ok(isPartialUndefined(isTupleOf([isString]))([undefined]));

	throws(() => {
		// @ts-expect-error
		isPartialUndefined();
	}, TypeError);

	throws(() => {
		// @ts-expect-error
		isPartialUndefined(isString);
	}, TypeError);

	end();
});