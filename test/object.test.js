'use strict';

/* eslint-disable no-new-wrappers */

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
const { isOptional } = require('r-assign/lib/optional');
const { isString } = require('r-assign/lib/string');

const { assign, create } = Object;

const circularRefShape = '{\n "obj": <Circular Reference>;\n}';
const objectShape = '{\n "abc": string;\n}';
const optionalObjectShape = '{\n "abc"?: (string | undefined);\n}';
const expected = `expected an object of shape ${objectShape}`;
const expectedOptional = `expected an object of shape ${optionalObjectShape}`;
const invalidDefaultValue = 'Invalid default value type';
const invalidTypeGuard = 'Invalid type guard provided';
const invalidValue = 'Invalid value type';
const received = 'but received null';
const receivedEmptyObject = 'but received a value of type {}';
const receivedObject = 'but received a value of type {\n "abc": number;\n}';
const receivedCircularRef = `but received a value of type ${circularRefShape}`;
const invalidShape = 'Shape is not an object';

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
		getObjectOf({ abc: null });
	}, TypeError(invalidTypeGuard));

	throws(() => {
		getObjectOf({ abc: isString }, null);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${received}`));

	throws(() => {
		getObjectOf({ abc: isOptional(isString) }, null);
	}, TypeError(`${invalidDefaultValue}, ${expectedOptional} ${received}`));

	end();
});

test('getStrictObjectOf', ({ end }) => {

	const getObjectABC = getStrictObjectOf({ abc: isString }, { abc: '' });

	match(getObjectABC(), { abc: '' });
	match(getObjectABC({ abc: '' }), { abc: '' });
	match(getObjectABC({ abc: 'abc' }), { abc: 'abc' });
	match(getObjectABC({ abc: 'abc', def: 'def' }), { abc: '' });

	throws(() => {
		getStrictObjectOf({ abc: isString }, null);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${received}`));

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
	}, TypeError(invalidShape));

	throws(() => {
		isObjectOf(null);
	}, TypeError(invalidShape));

	throws(() => {
		isObjectOf({});
	}, TypeError(invalidShape));

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

	end();
});

test('parseObjectOf', ({ end }) => {

	const parseObjectABC = parseObjectOf({ abc: isString });

	match(parseObjectABC({ abc: '' }), { abc: '' });
	match(parseObjectABC({ abc: '', def: null }), { abc: '' });

	const obj = {};

	obj.obj = obj;

	throws(() => {
		parseObjectABC(null);
	}, TypeError(`${invalidValue}, ${expected} ${received}`));

	throws(() => {
		parseObjectABC({});
	}, TypeError(`${invalidValue}, ${expected} ${receivedEmptyObject}`));

	throws(() => {
		parseObjectABC({
			abc: 0
		});
	}, TypeError(`${invalidValue}, ${expected} ${receivedObject}`));

	throws(() => {
		parseObjectABC(obj);
	}, TypeError(`${invalidValue}, ${expected} ${receivedCircularRef}`));

	const parseObjectABCWithPrototype = parseObjectOf(assign(create({
		def: null
	}), {
		abc: isString
	}));

	match(parseObjectABCWithPrototype({ abc: '' }), { abc: '' });

	end();
});

test('parseStrictObjectOf', ({ end }) => {

	const parseObjectABC = parseStrictObjectOf({ abc: isString });

	match(parseObjectABC({ abc: '' }), { abc: '' });

	throws(() => {
		parseObjectABC(null);
	}, TypeError(`${invalidValue}, ${expected} ${received}`));

	end();
});