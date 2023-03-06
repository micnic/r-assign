import { test, equal, notOk, ok, throws } from 'tap';
import {
	array,
	isArrayOf,
	isBoolean,
	isOptional,
	isString
} from 'r-assign';

const invalidOptionalType = 'Invalid use of optional type';
const invalidTypeGuard = 'Invalid type guard provided';

test('isArrayOf', ({ end }) => {

	const sparseArrayLength = 3;
	const sparseArray = new Array(sparseArrayLength);

	sparseArray[1] = true;

	equal(isArrayOf, array);

	ok(isArrayOf(isBoolean)([]));
	ok(isArrayOf(isBoolean)([true]));
	notOk(isArrayOf(isBoolean)(sparseArray));
	notOk(isArrayOf(isBoolean)());

	throws(() => {
		// @ts-expect-error
		isArrayOf();
	}, TypeError(invalidTypeGuard));

	throws(() => {
		// @ts-expect-error
		isArrayOf(isOptional(isString));
	}, TypeError(invalidOptionalType));

	end();
});