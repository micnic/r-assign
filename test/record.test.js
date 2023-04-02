import { test, equal, notOk, ok, throws } from 'tap';
import {
	isAny,
	isBoolean,
	isLiteral,
	isLiteralOf,
	isNumber,
	isOptional,
	isRecordOf,
	isString,
	isSymbol,
	isTemplateLiteralOf,
	isUnionOf,
	record
} from 'r-assign';

test('isRecordOf', ({ end }) => {

	equal(isRecordOf, record);

	ok(isRecordOf(isString)({}));
	ok(isRecordOf(isString)({ abc: 'def' }));
	ok(isRecordOf(isSymbol, isString)({ [Symbol()]: 'abc' }));
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
	ok(isRecordOf(isAny, isString)({}));

	notOk(isRecordOf(isString)({ abc: 1 }));
	notOk(isRecordOf(isString)({ [Symbol()]: 1 }));
	notOk(isRecordOf(isString)(null));
	notOk(isRecordOf(isNumber, isString)({ a: 'abc' }));
	notOk(isRecordOf(isUnionOf([isLiteral(1), isString]), isString)({}));

	notOk(
		isRecordOf(isUnionOf([isLiteral(1), isString, isSymbol]), isString)({})
	);

	throws(() => {
		// @ts-expect-error
		isRecordOf();
	});

	throws(() => {
		// @ts-expect-error
		isRecordOf(isOptional(isString), isString);
	});

	throws(() => {
		// @ts-expect-error
		isRecordOf(isOptional(isString));
	}, TypeError('Invalid use of optional type'));

	throws(() => {
		// @ts-expect-error
		isRecordOf(isBoolean, isString);
	}, TypeError('Invalid type for record keys'));

	end();
});