'use strict';

const { test } = require('tap');
const {
	isObject,
	useObject,
	useObjectValidation
} = require('r-assign/lib/object');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');

test('isObject', ({ end, notOk, ok, throws }) => {

	ok(isObject({ boolean: isBoolean }, { boolean: false }));
	ok(isObject({
		number: isNumber,
		string: isString
	}, { boolean: false, number: 0, string: '' }));
	notOk(isObject({ boolean: isBoolean }, null));
	notOk(isObject({ boolean: isBoolean }, { boolean: 0 }));

	throws(() => {
		isObject();
	});

	throws(() => {
		isObject(null);
	});

	throws(() => {
		isObject(0);
	});

	end();
});

test('useObject', ({ end, matches, throws }) => {

	const getObjectABC = useObject({ abc: isString }, { abc: '' });

	matches(getObjectABC(), { abc: '' });
	matches(getObjectABC({ abc: '' }), { abc: '' });
	matches(getObjectABC({ abc: 'abc' }), { abc: 'abc' });

	throws(() => {
		useObject();
	});

	throws(() => {
		useObject(null);
	});

	throws(() => {
		useObject(0);
	});

	throws(() => {
		useObject({ abc: isString });
	});

	throws(() => {
		useObject({ abc: isString }, {});
	});

	throws(() => {
		useObject({ abc: null }, {});
	});

	throws(() => {
		useObject({ abc: () => null }, {});
	});

	end();
});

test('useObjectValidation', ({ end, matches, throws }) => {

	const validateObjectABC = useObjectValidation({ abc: isString });

	matches(validateObjectABC({ abc: '' }), { abc: '' });

	throws(() => {
		validateObjectABC();
	});

	end();
});