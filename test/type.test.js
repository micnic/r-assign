'use strict';

const { test } = require('tap');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString, useString } = require('r-assign/lib/string');
const {
	isTypeOf,
	useOptional,
	useTypeOf,
	useValidation
} = require('r-assign/lib/type');

test('isTypeOf', ({ end, notOk, ok, throws }) => {

	ok(isTypeOf(true, [isBoolean]));
	ok(isTypeOf(true, [isBoolean, isNumber]));
	notOk(isTypeOf(true, [isNumber]));

	throws(() => {
		isTypeOf();
	});

	throws(() => {
		isTypeOf(null, [null]);
	});

	throws(() => {
		isTypeOf(null, [() => null]);
	});

	end();
});

test('useOptional', ({ end, equals, throws }) => {

	const getOptionalString = useOptional(useString());

	equals(typeof getOptionalString(), 'undefined');
	equals(getOptionalString(''), '');
	equals(getOptionalString('data'), 'data');
	equals(getOptionalString(null), '');

	throws(() => {
		useOptional();
	});

	end();
});

test('useTypeOf', ({ end, equals, throws }) => {

	const getStringOrNumber = useTypeOf('', [isNumber, isString]);

	equals(getStringOrNumber(), '');
	equals(getStringOrNumber(0), 0);
	equals(getStringOrNumber(1), 1);
	equals(getStringOrNumber(''), '');
	equals(getStringOrNumber('data'), 'data');

	throws(() => {
		useTypeOf();
	});

	throws(() => {
		useTypeOf(null, [null]);
	});

	throws(() => {
		useTypeOf(null, [() => null]);
	});

	throws(() => {
		useTypeOf(null, [isString]);
	});

	end();
});

test('useValidation', ({ end, equals, throws }) => {

	const validateString = useValidation(isString);

	equals(validateString(''), '');

	throws(() => {
		validateString(null);
	});

	end();
});