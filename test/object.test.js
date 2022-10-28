'use strict';

const { test, equal, match, notOk, ok, throws } = require('tap');
const {
	getObjectOf,
	getStrictObjectOf,
	isKeyOf,
	isObjectOf,
	isOmitFrom,
	isOptional,
	isOptionalUndefined,
	isPickFrom,
	isRecordOf,
	isStrictObjectOf,
	isString,
	keyof,
	object,
	omit,
	parseObjectOf,
	parseStrictObjectOf,
	parseType,
	pick,
	strictObject
} = require('r-assign/lib');

const { assign, create } = Object;

const circularRefShape = '{\n "obj": <Circular Reference>;\n}';
const objectShape = '{\n "abc": string;\n}';
const optionalObjectShape = '{\n "abc"?: string;\n}';
const expected = `expected an object of shape ${objectShape}`;
const expectedKeys = 'expected strings or array of strings';
const expectedStrict = `expected an object of strict shape ${objectShape}`;
const expectedOptional = `expected an object of shape ${optionalObjectShape}`;
const invalidDefaultValue = 'Invalid default value type';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidMapping = 'Invalid object mapping provided';
const invalidShape = 'Invalid shape provided';
const invalidValue = 'Invalid value type';
const received = 'but received null';
const receivedEmptyObject = 'but received a value of type {}';
const receivedObject = 'but received a value of type {\n "abc": number;\n}';
const receivedCircularRef = `but received a value of type ${circularRefShape}`;

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
		// @ts-expect-error
		getObjectOf({ abc: isString }, null);
	}, TypeError(`${invalidDefaultValue}, ${expected} ${received}`));

	throws(() => {
		// @ts-expect-error
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
		// @ts-expect-error
		getStrictObjectOf({ abc: isString }, null);
	}, TypeError(`${invalidDefaultValue}, ${expectedStrict} ${received}`));

	end();
});

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

	ok(isObjectOf({}, isRecordOf(isString, isString))({}));
	ok(isObjectOf({}, isRecordOf(isString, isString))({ a: 'a' }));

	throws(() => {
		// @ts-expect-error
		isObjectOf();
	}, TypeError(invalidShape));

	throws(() => {
		// @ts-expect-error
		isObjectOf(null);
	}, TypeError(invalidShape));

	throws(() => {
		// @ts-expect-error
		isObjectOf({}, isString);
	}, TypeError(invalidMapping));

	throws(() => {
		isObjectOf({}, isStrictObjectOf({}));
	}, TypeError(invalidMapping));

	throws(() => {
		parseType(isObjectOf({}, isObjectOf({ a: isString })))({});
	});

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
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
			'abc'
		)({
			def: 'def',
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
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
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
			['abc', 'def']
		)({
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
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
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
			'abc'
		)({
			abc: 'abc'
		})
	);
	notOk(
		isPickFrom(
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
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
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
			['abc', 'def']
		)({
			abc: 'abc',
			def: 'def'
		})
	);
	notOk(
		isPickFrom(
			isStrictObjectOf({ abc: isString, def: isString, ghi: isString }),
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

test('isStrictObjectOf', ({ end }) => {

	equal(isStrictObjectOf, strictObject);

	ok(isStrictObjectOf({ a: isString })({ a: 'abc' }));
	ok(isStrictObjectOf({ a: isOptional(isString) })({ a: 'abc' }));
	ok(isStrictObjectOf({ a: isOptional(isString) })({}));
	ok(isStrictObjectOf({ a: isOptionalUndefined(isString) })({ a: 'abc' }));
	ok(isStrictObjectOf({ a: isOptionalUndefined(isString) })({
		a: undefined
	}));
	ok(isStrictObjectOf({ a: isOptionalUndefined(isString) })({}));
	notOk(isStrictObjectOf({ a: isString })({ a: 'abc', b: 'def' }));
	notOk(isStrictObjectOf({ a: isOptional(isString) })({ a: undefined }));
	notOk(isStrictObjectOf({ a: isOptionalUndefined(isString) })({ a: null }));

	throws(() => {
		// @ts-expect-error
		isStrictObjectOf();
	}, TypeError(invalidShape));

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
	}, TypeError(`${invalidValue}, ${expectedStrict} ${received}`));

	end();
});