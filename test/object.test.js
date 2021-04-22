'use strict';

const { test, match, notOk, ok, throws } = require('tap');
const {
	getObjectOf,
	getStrictObjectOf,
	isObjectOf,
	isStrictObjectOf,
	parseObjectOf,
	parseStrictObjectOf
} = require('r-assign/lib/object');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');

test('getObjectOf', ({ end }) => {

	const getObjectABC = getObjectOf({ abc: isString }, { abc: '' });

	match(getObjectABC(), { abc: '' });
	match(getObjectABC({ abc: '' }), { abc: '' });
	match(getObjectABC({ abc: 'abc' }), { abc: 'abc' });
	match(getObjectABC({
		abc: 'abc',
		def: 'def'
	}), {
		abc: 'abc'
	});

	throws(() => {
		getObjectOf();
	});

	throws(() => {
		getObjectOf(null);
	});

	throws(() => {
		getObjectOf(0);
	});

	throws(() => {
		getObjectOf({ abc: isString });
	});

	throws(() => {
		getObjectOf({ abc: isString }, {});
	});

	throws(() => {
		getObjectOf({ abc: null }, {});
	});

	throws(() => {
		getObjectOf({ abc: () => null }, {});
	});

	end();
});

test('getStrictObjectOf', ({ end }) => {

	const getObjectABC = getStrictObjectOf({ abc: isString }, { abc: '' });

	match(getObjectABC(), { abc: '' });
	match(getObjectABC({ abc: '' }), { abc: '' });
	match(getObjectABC({ abc: 'abc' }), { abc: 'abc' });
	match(getObjectABC({ abc: 'abc', def: 'def' }), { abc: '' });

	throws(() => {
		getStrictObjectOf();
	});

	throws(() => {
		getStrictObjectOf(null);
	});

	throws(() => {
		getStrictObjectOf(0);
	});

	throws(() => {
		getStrictObjectOf({ abc: isString });
	});

	throws(() => {
		getStrictObjectOf({ abc: isString }, {});
	});

	throws(() => {
		getStrictObjectOf({ abc: isString }, { abc: '', def: '' });
	});

	throws(() => {
		getStrictObjectOf({ abc: null }, {});
	});

	throws(() => {
		getStrictObjectOf({ abc: () => null }, {});
	});

	end();
});

test('isObjectOf', ({ end }) => {

	ok(isObjectOf({ boolean: isBoolean })({ boolean: false }));
	ok(isObjectOf({
		number: isNumber,
		string: isString
	})({ boolean: false, number: 0, string: '' }));
	notOk(isObjectOf({ boolean: isBoolean })(null));
	notOk(isObjectOf({ boolean: isBoolean })({ boolean: 0 }));

	throws(() => {
		isObjectOf();
	});

	throws(() => {
		isObjectOf(null);
	});

	throws(() => {
		isObjectOf(0);
	});

	end();
});

test('isStrictObjectOf', ({ end }) => {

	ok(isStrictObjectOf({ boolean: isBoolean })({ boolean: false }));
	notOk(isStrictObjectOf({
		number: isNumber,
		string: isString
	})({ boolean: false, number: 0, string: '' }));
	notOk(isStrictObjectOf({ boolean: isBoolean })(null));
	notOk(isStrictObjectOf({ boolean: isBoolean })({ boolean: 0 }));

	throws(() => {
		isStrictObjectOf();
	});

	throws(() => {
		isStrictObjectOf(null);
	});

	throws(() => {
		isStrictObjectOf(0);
	});

	end();
});

test('parseObjectOf', ({ end }) => {

	const validateObjectABC = parseObjectOf({ abc: isString });

	match(validateObjectABC({ abc: '' }), { abc: '' });
	match(validateObjectABC({ abc: '', def: null }), { abc: '', def: null });

	throws(() => {
		validateObjectABC();
	});

	const validateObjectABCWithPrototype = parseObjectOf(Object.create({
		abc: isString
	}));

	match(validateObjectABCWithPrototype({}), {});

	end();
});

test('parseStrictObjectOf', ({ end }) => {

	const validateObjectABC = parseStrictObjectOf({ abc: isString });

	match(validateObjectABC({ abc: '' }), { abc: '' });

	throws(() => {
		validateObjectABC({ abc: '', def: null });
	});

	throws(() => {
		validateObjectABC();
	});

	end();
});