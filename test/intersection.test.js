import { test, notOk, ok, throws } from 'tap';
import {
	isAny,
	isBoolean,
	isIntersectionOf,
	isNumber,
	isObjectOf,
	isOptional,
	isString
} from 'r-assign';

test('isIntersectionOf', ({ end }) => {

	ok(isIntersectionOf([isBoolean, isNumber, isAny])(''));

	ok(isIntersectionOf([isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})])({ number: 0, string: '' }));

	ok(isIntersectionOf([isObjectOf({
		boolean: isBoolean
	}), isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})])({ boolean: false, number: 0, string: '' }));

	notOk(isIntersectionOf([isObjectOf({
		boolean: isBoolean
	}), isObjectOf({
		number: isNumber
	}), isObjectOf({
		string: isString
	})])({ boolean: false, number: 0 }));

	throws(() => {
		// @ts-expect-error
		isIntersectionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		// @ts-expect-error
		isIntersectionOf([]);
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		// @ts-expect-error
		isIntersectionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isIntersectionOf([isNumber, isString]);
	}, TypeError('Provided intersection is impossible'));

	throws(() => {
		isIntersectionOf([isOptional(isNumber), isString]);
	}, TypeError('Optional type cannot be used in intersection declaration'));

	end();
});