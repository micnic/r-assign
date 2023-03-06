import { test, equal, notOk, ok, throws } from 'tap';
import {
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
	}, TypeError('Optional type cannot be used in union declaration'));

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
	}, TypeError('Optional type cannot be used in union declaration'));

	end();
});