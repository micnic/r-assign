import { test, equal, notOk, ok, throws } from 'tap';
import {
	isKeyOf,
	isObjectOf,
	isOmitFrom,
	isOptional,
	isOptionalUndefined,
	isPickFrom,
	isRecordOf,
	isString,
	keyof,
	object,
	omit,
	parseType,
	pick,
	setStrict,
	strict
} from 'r-assign';

const expectedKeys = 'expected strings or array of strings';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidMapping = 'Invalid object mapping provided';
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
		isObjectOf({}, setStrict(isObjectOf({})));
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
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
			'abc'
		)({
			def: 'def',
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
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
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
			['abc', 'def']
		)({
			ghi: 'ghi'
		})
	);
	notOk(
		isOmitFrom(
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
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
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
			'abc'
		)({
			abc: 'abc'
		})
	);
	notOk(
		isPickFrom(
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
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
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
			['abc', 'def']
		)({
			abc: 'abc',
			def: 'def'
		})
	);
	notOk(
		isPickFrom(
			setStrict(
				isObjectOf({ abc: isString, def: isString, ghi: isString })
			),
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

test('setStrict', ({ end }) => {

	equal(setStrict, strict);

	ok(setStrict(isObjectOf({ a: isString }))({ a: 'abc' }));
	ok(setStrict(isObjectOf({ a: isOptional(isString) }))({ a: 'abc' }));
	ok(setStrict(isObjectOf({ a: isOptional(isString) }))({}));
	ok(
		setStrict(isObjectOf({ a: isOptionalUndefined(isString) }))({
			a: 'abc'
		})
	);
	ok(setStrict(isObjectOf({ a: isOptionalUndefined(isString) }))({
		a: undefined
	}));
	ok(setStrict(isObjectOf({ a: isOptionalUndefined(isString) }))({}));
	notOk(setStrict(isObjectOf({ a: isString }))({ a: 'abc', b: 'def' }));
	notOk(setStrict(isObjectOf({ a: isOptional(isString) }))({ a: undefined }));
	notOk(
		setStrict(isObjectOf({ a: isOptionalUndefined(isString) }))({ a: null })
	);

	throws(() => {
		// @ts-expect-error
		setStrict();
	});

	throws(() => {
		// @ts-expect-error
		setStrict(isString);
	}, TypeError('Invalid type for "setStrict()", only object type is allowed'));

	end();
});