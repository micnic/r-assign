'use strict';

const { test, equal, notOk, ok, throws } = require('tap');
const {
	isAny,
	isBoolean,
	isLiteral,
	isLiteralOf,
	isNumber,
	isOptional,
	isRecordOf,
	isString,
	isTemplateLiteralOf,
	isUnionOf,
	record
} = require('r-assign/lib');

test('isRecordOf', ({ end }) => {

	equal(isRecordOf, record);

	ok(isRecordOf(isString, isString)({}));
	ok(isRecordOf(isString, isString)({ abc: 'def' }));
	ok(isRecordOf(isNumber, isString)({ 1: 'abc' }));
	ok(isRecordOf(isLiteral('abc'), isString)({ abc: 'def' }));
	ok(isRecordOf(isLiteral(1), isString)({ 1: 'abc' }));
	ok(isRecordOf(isLiteralOf(['abc', 1]), isString)({ 1: 'a', abc: 'def' }));
	ok(
		isRecordOf(
			isTemplateLiteralOf(['a', isNumber]),
			isString
		)({ a0: 'abc' })
	);
	ok(
		isRecordOf(
			isTemplateLiteralOf([isLiteralOf(['a', 'b']), isNumber]),
			isString
		)({ b0: 'abc' })
	);
	ok(
		isRecordOf(
			isTemplateLiteralOf([
				isTemplateLiteralOf([isLiteralOf(['a', 'b']), isNumber]),
				isNumber
			]),
			isString
		)({ b00: 'abc' })
	);
	ok(
		isRecordOf(
			isTemplateLiteralOf([
				isUnionOf([isLiteral('a'), isLiteral('b')]),
				isNumber
			]),
			isString
		)({ b0: 'abc' })
	);
	ok(isRecordOf(isUnionOf([isNumber, isString]), isString)({ abc: 'def' }));
	ok(
		isRecordOf(
			isUnionOf([isLiteral('a'), isLiteral('b')]),
			isString
		)({ a: 'a', b: 'b' })
	);
	ok(
		isRecordOf(
			isUnionOf([isLiteral('a'), isLiteralOf(['b', 'c']), isString]),
			isString
		)({ a: 'a', b: 'b', c: 'c' })
	);

	notOk(isRecordOf(isString, isString)({ abc: 1 }));
	notOk(isRecordOf(isString, isString)(null));

	throws(() => {
		// @ts-expect-error
		isRecordOf(isOptional(isString), isString);
	}, TypeError('Optional type cannot be used in record declaration'));

	throws(() => {
		isRecordOf(isString, isOptional(isString));
	}, TypeError('Optional type cannot be used in record declaration'));

	throws(() => {
		isRecordOf(isAny, isString);
	}, TypeError('Invalid type guard for record keys'));

	throws(() => {
		// @ts-expect-error
		isRecordOf(isBoolean, isString);
	}, TypeError('Invalid type guard for record keys'));

	end();
});