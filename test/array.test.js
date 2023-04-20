import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, {
	array,
	isArrayOf,
	isOptional,
	isString
} from 'r-assign';

const invalidOptionalType = 'Invalid use of optional type';
const invalidTypeGuard = 'Invalid type guard provided';

const sparseArrayLength = 3;
const sparseArray = new Array(sparseArrayLength);

sparseArray[1] = '';

test('isArrayOf', ({ end }) => {

	equal(isArrayOf, array);

	ok(isArrayOf(isString)([]));
	ok(isArrayOf(isString)(['']));

	notOk(isArrayOf(isString)(sparseArray));
	notOk(isArrayOf(isString)());

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

test('assign isArrayOf', ({ end }) => {

	/** @type {string[]} */
	const value = [];

	equal(value, rAssign(isArrayOf(isString), value));

	value.push('');

	equal(value, rAssign(isArrayOf(isString), value));

	throws(() => {
		rAssign(isArrayOf(isString));
	});

	throws(() => {
		rAssign(isArrayOf(isString), sparseArray);
	});

	throws(() => {
		rAssign(isArrayOf(isString), ['', 0]);
	});

	end();
});