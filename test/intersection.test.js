import { test, equal, notOk, ok, throws } from 'tap';
import {
	intersection,
	isAny,
	isBigInt,
	isBoolean,
	isDate,
	isIntersectionOf,
	isNever,
	isNull,
	isNumber,
	isObjectOf,
	isOptional,
	isString,
	isSymbol,
	isUndefined,
	isUnionOf
} from 'r-assign';

test('isIntersectionOf', ({ end }) => {

	equal(isIntersectionOf, intersection);

	equal(isIntersectionOf([]), isNever);

	equal(isIntersectionOf([isAny]), isAny);
	equal(isIntersectionOf([isBigInt]), isBigInt);
	equal(isIntersectionOf([isBoolean]), isBoolean);
	equal(isIntersectionOf([isDate]), isDate);
	equal(isIntersectionOf([isNever]), isNever);
	equal(isIntersectionOf([isNull]), isNull);
	equal(isIntersectionOf([isNumber]), isNumber);
	equal(isIntersectionOf([isString]), isString);
	equal(isIntersectionOf([isSymbol]), isSymbol);
	equal(isIntersectionOf([isUndefined]), isUndefined);

	equal(isIntersectionOf([isAny, isBigInt]), isAny);
	equal(isIntersectionOf([isAny, isBoolean]), isAny);
	equal(isIntersectionOf([isAny, isDate]), isAny);
	equal(isIntersectionOf([isAny, isNever]), isAny);
	equal(isIntersectionOf([isAny, isNull]), isAny);
	equal(isIntersectionOf([isAny, isNumber]), isAny);
	equal(isIntersectionOf([isAny, isString]), isAny);
	equal(isIntersectionOf([isAny, isSymbol]), isAny);
	equal(isIntersectionOf([isAny, isUndefined]), isAny);

	ok(isIntersectionOf([isBoolean, isNumber, isAny])(''));

	ok(
		isIntersectionOf([
			isString,
			isIntersectionOf([
				isUnionOf([isString, isNumber]),
				isUnionOf([isNumber, isString])
			])
		])
	);

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

	notOk(isIntersectionOf([isString, isNumber])());

	throws(() => {
		// @ts-expect-error
		isIntersectionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		// @ts-expect-error
		isIntersectionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isIntersectionOf([isOptional(isNumber), isString]);
	});

	end();
});