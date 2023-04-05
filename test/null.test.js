import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, {
	isNull,
	isNullable,
	isNullish,
	isOptional,
	isString,
	nullable,
	nulled,
	nullish
} from 'r-assign';

test('isNull', ({ end }) => {

	equal(isNull, nulled);

	ok(isNull(null));

	notOk(isNull());

	end();
});

test('assign isNull', ({ end }) => {

	equal(null, rAssign(isNull, null));

	throws(() => {
		rAssign(isNull);
	});

	end();
});

test('isNullable', ({ end }) => {

	const isNullableString = isNullable(isString);

	equal(isNullable, nullable);

	ok(isNullableString(null));
	ok(isNullableString(''));

	notOk(isNullableString());

	throws(() => {
		// @ts-expect-error
		isNullable();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isNullable(isOptional(isString));
	});

	end();
});

test('assign isNullable', ({ end }) => {

	equal(null, rAssign(isNullable(isString), null));
	equal('', rAssign(isNullable(isString), ''));

	throws(() => {
		rAssign(isNullable(isString));
	});

	end();
});

test('isNullish', ({ end }) => {

	const isNullishString = isNullish(isString);

	equal(isNullish, nullish);

	ok(isNullishString(null));
	ok(isNullishString());
	ok(isNullishString(''));

	notOk(isNullishString(true));

	throws(() => {
		// @ts-expect-error
		isNullish();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isNullish(isOptional(isString));
	});

	end();
});

test('assign isNullish', ({ end }) => {

	equal(undefined, rAssign(isNullish(isString)));
	equal(undefined, rAssign(isNullish(isString), undefined));
	equal(null, rAssign(isNullish(isString), null));
	equal('', rAssign(isNullish(isString), ''));

	throws(() => {
		rAssign(isNullish(isString), true);
	});

	end();
});