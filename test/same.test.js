import { test, equal, throws } from 'tap';
import {
	isArrayOf,
	isObjectOf,
	isRecordOf,
	isString,
	isTupleOf,
	parseType,
	same,
	setSame
} from 'r-assign';

test('setSame', ({ end }) => {

	equal(setSame, same);

	const array = ['a'];

	equal(parseType(setSame(isArrayOf(isString)))(array), array);
	equal(parseType(setSame(isTupleOf([isString])))(array), array);

	const object = { a: 'a', b: 'b' };

	equal(parseType(setSame(isObjectOf({ a: isString })))(object), object);
	equal(parseType(setSame(isRecordOf(isString)))(object), object);

	throws(() => {
		// @ts-expect-error
		setSame(isString);
	}, TypeError);

	end();
});