import { test, equal, notOk, ok, throws } from 'tap';
import {
	isAny,
	isBigInt,
	isArrayOf,
	isBoolean,
	isDate,
	isLiteral,
	isLiteralOf,
	isNever,
	isNull,
	isNumber,
	isOptional,
	isString,
	isSymbol,
	isTemplateLiteralOf,
	isUndefined,
	isUnionOf,
	union
} from 'r-assign';

test('isUnionOf', ({ end }) => {

	equal(isUnionOf, union);

	equal(isUnionOf([]), isNever);

	equal(isUnionOf([isAny]), isAny);
	equal(isUnionOf([isBigInt]), isBigInt);
	equal(isUnionOf([isBoolean]), isBoolean);
	equal(isUnionOf([isDate]), isDate);
	equal(isUnionOf([isNever]), isNever);
	equal(isUnionOf([isNull]), isNull);
	equal(isUnionOf([isNumber]), isNumber);
	equal(isUnionOf([isString]), isString);
	equal(isUnionOf([isSymbol]), isSymbol);
	equal(isUnionOf([isUndefined]), isUndefined);

	equal(isUnionOf([isAny, isBigInt]), isAny);
	equal(isUnionOf([isAny, isBoolean]), isAny);
	equal(isUnionOf([isAny, isDate]), isAny);
	equal(isUnionOf([isAny, isNever]), isAny);
	equal(isUnionOf([isAny, isNull]), isAny);
	equal(isUnionOf([isAny, isNumber]), isAny);
	equal(isUnionOf([isAny, isString]), isAny);
	equal(isUnionOf([isAny, isSymbol]), isAny);
	equal(isUnionOf([isAny, isUndefined]), isAny);

	equal(isUnionOf([isBigInt, isBigInt]), isBigInt);
	equal(isUnionOf([isBoolean, isBoolean]), isBoolean);
	equal(isUnionOf([isDate, isDate]), isDate);
	equal(isUnionOf([isNever, isNever]), isNever);
	equal(isUnionOf([isNull, isNull]), isNull);
	equal(isUnionOf([isNumber, isNumber]), isNumber);
	equal(isUnionOf([isString, isString]), isString);
	equal(isUnionOf([isSymbol, isSymbol]), isSymbol);
	equal(isUnionOf([isUndefined, isUndefined]), isUndefined);

	equal(isUnionOf([isLiteral(0n), isBigInt]), isBigInt);
	equal(isUnionOf([isLiteral(false), isBoolean]), isBoolean);
	equal(isUnionOf([isLiteral(0), isNumber]), isNumber);
	equal(isUnionOf([isLiteral(''), isString]), isString);

	equal(isUnionOf([isLiteralOf([0n]), isBigInt]), isBigInt);
	equal(isUnionOf([isLiteralOf([false]), isBoolean]), isBoolean);
	equal(isUnionOf([isLiteralOf([0]), isNumber]), isNumber);
	equal(isUnionOf([isLiteralOf(['']), isString]), isString);

	equal(isUnionOf([isTemplateLiteralOf([isNumber]), isString]), isString);

	ok(isUnionOf([isNumber, isString])(0));
	ok(isUnionOf([isNumber, isString])(''));

	ok(isUnionOf([isLiteral(''), isLiteralOf(['', ' '])])(' '));
	ok(isUnionOf([isLiteralOf(['', 0, 1]), isString])(' '));
	ok(isUnionOf([isLiteralOf(['', 0]), isString])(' '));

	// TODO: add a check for equivalent types
	ok(isUnionOf([isArrayOf(isNumber), isArrayOf(isNumber)])([0]));

	notOk(isUnionOf([isNumber, isString])(false));

	const isBooleanOrNumberOrString = isUnionOf([
		isBoolean,
		isUnionOf([isNumber, isString])
	]);

	ok(isBooleanOrNumberOrString(true));
	ok(isBooleanOrNumberOrString(0));
	ok(isBooleanOrNumberOrString(''));

	notOk(isBooleanOrNumberOrString());

	throws(() => {
		// @ts-expect-error
		isUnionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		// @ts-expect-error
		isUnionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isUnionOf([isOptional(isString), isString]);
	});

	end();
});