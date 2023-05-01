import { test, equal, notOk, ok, throws } from 'tap';
import {
	isAny,
	isArrayOf,
	isBigInt,
	isBoolean,
	isIntersectionOf,
	isLiteral,
	isLiteralOf,
	isNullable,
	isNumber,
	isObjectOf,
	isOptional,
	isString,
	isSymbol,
	isTemplateLiteralOf,
	isUnionOf,
	templateLiteral
} from 'r-assign';

test('isTemplateLiteralOf', ({ end }) => {

	equal(isTemplateLiteralOf, templateLiteral);

	ok(isTemplateLiteralOf([])(''));
	ok(isTemplateLiteralOf([''])(''));
	ok(isTemplateLiteralOf([true])('true'));
	ok(isTemplateLiteralOf([0])('0'));
	ok(isTemplateLiteralOf(['abc'])('abc'));
	ok(isTemplateLiteralOf(['abc', 'def'])('abcdef'));
	ok(isTemplateLiteralOf([isAny])(''));
	ok(isTemplateLiteralOf([isAny])('abc'));
	ok(isTemplateLiteralOf([isBigInt])('0'));
	ok(isTemplateLiteralOf([isBoolean])('false'));
	ok(isTemplateLiteralOf([isBoolean])('true'));
	ok(isTemplateLiteralOf([isLiteralOf(['a', 'b']), '-', isNumber])('a-0'));
	ok(isTemplateLiteralOf([isUnionOf([isBigInt, isString, isNumber])])('0'));
	ok(isTemplateLiteralOf([isUnionOf([isLiteral('a'), isLiteral('b')])])('a'));
	ok(isTemplateLiteralOf([isUnionOf([isLiteral('a'), isNumber])])('1'));
	ok(
		isTemplateLiteralOf([isUnionOf([isNumber, isLiteralOf(['a', 'b'])])])(
			'a'
		)
	);
	ok(
		isTemplateLiteralOf([
			isUnionOf([isNumber, isTemplateLiteralOf(['a-', isNumber])])
		])('a-0')
	);
	ok(isTemplateLiteralOf([isLiteral('')])(''));
	ok(isTemplateLiteralOf([isLiteral('abc')])('abc'));
	ok(isTemplateLiteralOf([isLiteral(0)])('0'));
	ok(isTemplateLiteralOf([isLiteralOf(['abc', 'def'])])('def'));
	ok(isTemplateLiteralOf([isNullable(isBoolean)])('true'));
	ok(isTemplateLiteralOf([isNullable(isBoolean)])('false'));
	ok(isTemplateLiteralOf([isNullable(isBoolean)])('null'));

	ok(isTemplateLiteralOf([isNumber])('0'));
	ok(isTemplateLiteralOf([isNumber])('0.'));
	ok(isTemplateLiteralOf([isNumber])('.0'));
	ok(isTemplateLiteralOf([isNumber])('0.0'));
	ok(isTemplateLiteralOf([isNumber])('0.0e0'));
	ok(isTemplateLiteralOf([isNumber])('0.0e+0'));
	ok(isTemplateLiteralOf([isNumber])('0.0e-0'));
	ok(isTemplateLiteralOf([isNumber])('0.0E0'));
	ok(isTemplateLiteralOf([isNumber])('0.0E+0'));
	ok(isTemplateLiteralOf([isNumber])('0.0E-0'));
	ok(isTemplateLiteralOf([isNumber])('00.00E-00'));
	ok(isTemplateLiteralOf([isNumber])('+0'));
	ok(isTemplateLiteralOf([isNumber])('+0.'));
	ok(isTemplateLiteralOf([isNumber])('+.0'));
	ok(isTemplateLiteralOf([isNumber])('+0.0'));
	ok(isTemplateLiteralOf([isNumber])('+0.0e0'));
	ok(isTemplateLiteralOf([isNumber])('+0.0e+0'));
	ok(isTemplateLiteralOf([isNumber])('+0.0e-0'));
	ok(isTemplateLiteralOf([isNumber])('+0.0E0'));
	ok(isTemplateLiteralOf([isNumber])('+0.0E+0'));
	ok(isTemplateLiteralOf([isNumber])('+0.0E-0'));
	ok(isTemplateLiteralOf([isNumber])('+00.00E-00'));
	ok(isTemplateLiteralOf([isNumber])('-0'));
	ok(isTemplateLiteralOf([isNumber])('-0.'));
	ok(isTemplateLiteralOf([isNumber])('-.0'));
	ok(isTemplateLiteralOf([isNumber])('-0.0'));
	ok(isTemplateLiteralOf([isNumber])('-0.0e0'));
	ok(isTemplateLiteralOf([isNumber])('-0.0e+0'));
	ok(isTemplateLiteralOf([isNumber])('-0.0e-0'));
	ok(isTemplateLiteralOf([isNumber])('-0.0E0'));
	ok(isTemplateLiteralOf([isNumber])('-0.0E+0'));
	ok(isTemplateLiteralOf([isNumber])('-0.0E-0'));
	ok(isTemplateLiteralOf([isNumber])('-00.00E-00'));
	ok(isTemplateLiteralOf([isNumber])('0b01'));
	ok(isTemplateLiteralOf([isNumber])('0o01234567'));
	ok(isTemplateLiteralOf([isNumber])('0x0123456789ABCDEFabcdef'));

	ok(isTemplateLiteralOf([isString])(''));
	ok(isTemplateLiteralOf([isString])('abc'));
	ok(isTemplateLiteralOf([isString, isString])('abc'));
	ok(isTemplateLiteralOf([isString, isNumber])('a0'));
	ok(isTemplateLiteralOf([isTemplateLiteralOf([isString, 'a']), 'b'])('ab'));
	ok(isTemplateLiteralOf([isUnionOf([isString, isNumber])])('abc'));
	ok(isTemplateLiteralOf([isUnionOf([isString, isNumber])])('0'));

	notOk(isTemplateLiteralOf([])());
	notOk(isTemplateLiteralOf([])(' '));
	notOk(isTemplateLiteralOf(['abc'])(''));
	notOk(isTemplateLiteralOf([isBoolean])());
	notOk(isTemplateLiteralOf([isBoolean])(''));

	notOk(isTemplateLiteralOf([isNumber])(''));
	notOk(isTemplateLiteralOf([isNumber])('+'));
	notOk(isTemplateLiteralOf([isNumber])('-'));
	notOk(isTemplateLiteralOf([isNumber])('.'));
	notOk(isTemplateLiteralOf([isNumber])('0.0e'));
	notOk(isTemplateLiteralOf([isNumber])('0.0e+'));
	notOk(isTemplateLiteralOf([isNumber])('0.0e-'));
	notOk(isTemplateLiteralOf([isNumber])('+0b0'));
	notOk(isTemplateLiteralOf([isNumber])('+0o0'));
	notOk(isTemplateLiteralOf([isNumber])('+0x0'));
	notOk(isTemplateLiteralOf([isNumber])('-0b0'));
	notOk(isTemplateLiteralOf([isNumber])('-0o0'));
	notOk(isTemplateLiteralOf([isNumber])('-0x0'));

	// Check for working escaped characters
	notOk(isTemplateLiteralOf([isNumber, '.+'])('0...'));

	throws(() => {
		// @ts-expect-error
		isTemplateLiteralOf();
	}, TypeError('Invalid template literal provided'));

	throws(() => {
		// @ts-expect-error
		isTemplateLiteralOf([isSymbol]);
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		// @ts-expect-error
		isTemplateLiteralOf([isArrayOf(isString)]);
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		isTemplateLiteralOf([
			// @ts-expect-error
			isIntersectionOf([isObjectOf({
				a: isNumber
			}), isObjectOf({
				b: isString
			})])
		]);
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		// @ts-expect-error
		isTemplateLiteralOf([isUnionOf([isSymbol, isString])]);
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		// @ts-expect-error
		isTemplateLiteralOf([isUnionOf([isArrayOf(isString), isString])]);
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		// @ts-expect-error
		isTemplateLiteralOf([isOptional(isString)]);
	}, TypeError('Invalid use of optional type'));

	end();
});