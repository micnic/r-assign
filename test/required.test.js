'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	isObjectOf,
	isOptional,
	isOptionalUndefined,
	isRequired,
	isStrictObjectOf,
	isString,
	isTupleOf,
	required
} = require('r-assign/lib');

test('isRequired', ({ end }) => {

	equal(isRequired, required);

	ok(isRequired(isObjectOf({ a: isOptional(isString) }))({ a: 'abc' }));
	notOk(
		isRequired(isObjectOf({ a: isOptional(isString) }))({ a: undefined })
	);
	notOk(isRequired(isObjectOf({ a: isOptional(isString) }))({}));

	ok(
		isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
			a: 'abc'
		})
	);
	notOk(
		isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
			a: undefined
		})
	);
	notOk(isRequired(isObjectOf({ a: isString }))({}));

	ok(isRequired(isObjectOf({ a: isString }))({ a: 'abc' }));
	notOk(
		isRequired(isObjectOf({ a: isString }))({ a: undefined })
	);
	notOk(isRequired(isObjectOf({ a: isString }))({}));

	ok(isRequired(isStrictObjectOf({ a: isOptional(isString) }))({ a: 'abc' }));
	notOk(
		isRequired(isStrictObjectOf({ a: isOptional(isString) }))({
			a: undefined
		})
	);
	notOk(isRequired(isStrictObjectOf({ a: isOptional(isString) }))({}));

	ok(
		isRequired(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({
			a: 'abc'
		})
	);
	notOk(
		isRequired(isStrictObjectOf({ a: isOptionalUndefined(isString) }))({
			a: undefined
		})
	);
	notOk(isRequired(isStrictObjectOf({ a: isString }))({}));

	ok(isRequired(isStrictObjectOf({ a: isString }))({ a: 'abc' }));
	notOk(
		isRequired(isStrictObjectOf({ a: isString }))({ a: undefined })
	);
	notOk(isRequired(isStrictObjectOf({ a: isString }))({}));

	ok(isRequired(isTupleOf([isOptional(isString)]))(['abc']));
	notOk(isRequired(isTupleOf([isOptional(isString)]))([undefined]));
	notOk(isRequired(isTupleOf([isOptional(isString)]))([]));

	ok(isRequired(isTupleOf([isOptionalUndefined(isString)]))(['abc']));
	notOk(isRequired(isTupleOf([isOptionalUndefined(isString)]))([undefined]));
	notOk(isRequired(isTupleOf([isOptionalUndefined(isString)]))([]));

	ok(isRequired(isTupleOf([isString]))(['abc']));
	notOk(isRequired(isTupleOf([isString]))([undefined]));
	notOk(isRequired(isTupleOf([isString]))([]));

	throws(() => {
		// @ts-expect-error
		isRequired();
	}, TypeError);

	throws(() => {
		// @ts-expect-error
		isRequired(isString);
	}, TypeError);

	end();
});