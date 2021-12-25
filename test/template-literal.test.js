'use strict';

const { test, notOk, ok, throws } = require('tap');
const {
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
	isUnionOf
} = require('r-assign/lib');

const templateLiteral = 'template literal declaration';

test('isTemplateLiteralOf', ({ end }) => {

	ok(isTemplateLiteralOf([])(''));
	ok(isTemplateLiteralOf([true])('true'));
	ok(isTemplateLiteralOf([0])('0'));
	ok(isTemplateLiteralOf(['abc'])('abc'));
	ok(isTemplateLiteralOf(['abc', 'def'])('abcdef'));
	ok(isTemplateLiteralOf([isAny])(''));
	ok(isTemplateLiteralOf([isAny])('abc'));
	ok(isTemplateLiteralOf([isBigInt])('0'));
	ok(isTemplateLiteralOf([isBoolean])('false'));
	ok(isTemplateLiteralOf([isBoolean])('true'));
	ok(
		isTemplateLiteralOf([
			isIntersectionOf([
				isUnionOf([isBoolean, isNumber, isBigInt]),
				isUnionOf([isString, isBoolean])
			])
		])('true')
	);
	ok(
		isTemplateLiteralOf([
			isIntersectionOf([
				isIntersectionOf([
					isUnionOf([isBoolean, isNumber, isBigInt]),
					isUnionOf([isString, isBoolean])
				]),
				isUnionOf([isString, isBoolean])
			])
		])('true')
	);
	ok(isTemplateLiteralOf([isLiteral('abc')])('abc'));
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
	ok(isTemplateLiteralOf([isTemplateLiteralOf([isString, 'a']), 'b'])('ab'));
	ok(isTemplateLiteralOf([isUnionOf([isString, isNumber])])('abc'));
	ok(isTemplateLiteralOf([isUnionOf([isString, isNumber])])('0'));
	ok(
		isTemplateLiteralOf([
			isUnionOf([isLiteral('NaN'), isLiteralOf([0, 1])])
		])('0')
	);
	ok(
		isTemplateLiteralOf([
			isUnionOf([
				isUnionOf([isLiteral('A'), isLiteral('a')]),
				isIntersectionOf([
					isUnionOf([isLiteral('B'), isLiteral('b')]),
					isUnionOf([isLiteral('C'), isLiteral('b')])
				])
			])
		])('a')
	);

	notOk(isTemplateLiteralOf([])());
	notOk(isTemplateLiteralOf([])(' '));
	notOk(isTemplateLiteralOf(['abc'])(''));
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

	throws(() => {
		isTemplateLiteralOf([isSymbol])('symbol');
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		isTemplateLiteralOf([isArrayOf(isString)])('[]');
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		isTemplateLiteralOf([
			isIntersectionOf([isObjectOf({
				a: isNumber
			}), isObjectOf({
				b: isString
			})])
		])('a');
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		isTemplateLiteralOf([isUnionOf([isSymbol, isString])])('[]');
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		isTemplateLiteralOf([isUnionOf([isArrayOf(isString), isString])])('[]');
	}, TypeError('Invalid type for template literal type'));

	throws(() => {
		isTemplateLiteralOf([isOptional(isString)])('abc');
	}, TypeError(`Optional type cannot be used in ${templateLiteral}`));

	end();
});