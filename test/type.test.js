'use strict';

const tap = require('tap');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString, useString } = require('r-assign/lib/string');
const {
	isTypeOf,
	useOptional,
	useTypeOf,
	useValidation
} = require('r-assign/lib/type');

tap.test('isTypeOf', (test) => {
	tap.test('Valid cases', (t) => {
		t.ok(isTypeOf(true, [isBoolean]));
		t.ok(isTypeOf(true, [isBoolean, isNumber]));
		t.notOk(isTypeOf(true, [isNumber]));
		t.end();
	});

	tap.test('Invalid cases', (t) => {
		t.throws(() => {
			isTypeOf();
		});
		t.throws(() => {
			isTypeOf(null, [null]);
		});
		t.throws(() => {
			isTypeOf(null, [() => null]);
		});
		t.end();
	});

	test.end();
});

tap.test('useOptional', (test) => {
	tap.test('No arguments', (t) => {
		t.throws(() => {
			useOptional();
		});
		t.end();
	});
	tap.test('Transform function provided', (t) => {
		const getOptionalString = useOptional(useString());

		t.equal(typeof getOptionalString(), 'undefined');
		t.equal(getOptionalString(''), '');
		t.equal(getOptionalString('data'), 'data');
		t.equal(getOptionalString(null), '');
		t.end();
	});

	test.end();
});

tap.test('useTypeOf', (test) => {

	tap.test('Valid cases', (t) => {
		const getStringOrNumber = useTypeOf('', [isNumber, isString]);

		t.equal(getStringOrNumber(), '');
		t.equal(getStringOrNumber(0), 0);
		t.equal(getStringOrNumber(1), 1);
		t.equal(getStringOrNumber(''), '');
		t.equal(getStringOrNumber('data'), 'data');

		t.end();
	});

	tap.test('Invalid cases', (t) => {
		t.throws(() => {
			useTypeOf();
		});
		t.throws(() => {
			useTypeOf(null, [null]);
		});
		t.throws(() => {
			useTypeOf(null, [() => null]);
		});
		t.throws(() => {
			useTypeOf(null, [isString]);
		});
		t.end();
	});

	test.end();
});

tap.test('useValidation', (test) => {

	tap.test('Valid cases', (t) => {
		const validateString = useValidation(isString);

		t.equal(validateString(''), '');
		t.end();
	});

	tap.test('Invalid cases', (t) => {
		const validateString = useValidation(isString);

		t.throws(() => {
			validateString(0);
		});
		t.end();
	});

	test.end();
});