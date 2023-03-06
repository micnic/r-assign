import { test, equal, notOk, ok, throws } from 'tap';
import {
	isAny,
	isArrayOf,
	isBoolean,
	isLiteral,
	isLiteralOf,
	isNumber,
	isOptional,
	isString,
	isTemplateLiteralOf,
	isUnionOf,
	union
} from 'r-assign';

const invalidOptionalType = 'Optional type cannot be used in union declaration';

test('isUnionOf', ({ end }) => {

	equal(isUnionOf, union);

	ok(isUnionOf([isBoolean, isNumber, isAny])(''));
	ok(isUnionOf([isBoolean, isNumber])(true));
	ok(isUnionOf([isBoolean, isNumber])(0));
	ok(isUnionOf([isLiteral('a'), isString])(''));
	ok(isUnionOf([isLiteral('a'), isLiteralOf(['a', 'b'])])('a'));
	ok(isUnionOf([isLiteralOf(['a', 0, 1]), isString])('a'));
	ok(isUnionOf([isLiteralOf(['a', 0]), isString])('a'));
	ok(isUnionOf([isTemplateLiteralOf([isNumber]), isString])(''));

	// TODO: add a check for equivalent types
	ok(isUnionOf([isArrayOf(isBoolean), isArrayOf(isBoolean)])([true]));

	notOk(isUnionOf([isBoolean, isNumber])(''));

	const isBooleanOrNumberOrString = isUnionOf([
		isBoolean,
		isUnionOf([isNumber, isString])
	]);

	ok(isBooleanOrNumberOrString(true));
	ok(isBooleanOrNumberOrString(0));
	ok(isBooleanOrNumberOrString(''));
	notOk(isBooleanOrNumberOrString());

	equal(isUnionOf([isBoolean, isBoolean]), isBoolean);

	throws(() => {
		// @ts-expect-error
		isUnionOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		// @ts-expect-error
		isUnionOf([]);
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		// @ts-expect-error
		isUnionOf(Array(1 + 1));
	}, TypeError('Not enough type guards, at least two expected'));

	throws(() => {
		// @ts-expect-error
		isUnionOf([null, null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isUnionOf([isOptional(isString), isString]);
	}, TypeError(invalidOptionalType));

	end();
});