'use strict';

const { test, equal, ok } = require('tap');
const lib = require('r-assign/lib');

const methods = 51;

test('rAssign lib exports', ({ end }) => {
	equal(Object.keys(lib).length, methods);
	ok('getAny' in lib);
	ok('getAnyNumber' in lib);
	ok('getArrayOf' in lib);
	ok('getBigInt' in lib);
	ok('getBoolean' in lib);
	ok('getInstanceOf' in lib);
	ok('getIntersectionOf' in lib);
	ok('getLiteral' in lib);
	ok('getLiteralOf' in lib);
	ok('getNumber' in lib);
	ok('getObjectOf' in lib);
	ok('getOptional' in lib);
	ok('getStrictObjectOf' in lib);
	ok('getString' in lib);
	ok('getSymbol' in lib);
	ok('getTupleOf' in lib);
	ok('getUnionOf' in lib);
	ok('isAny' in lib);
	ok('isAnyNumber' in lib);
	ok('isArrayOf' in lib);
	ok('isBigInt' in lib);
	ok('isBoolean' in lib);
	ok('isInstanceOf' in lib);
	ok('isIntersectionOf' in lib);
	ok('isLiteral' in lib);
	ok('isLiteralOf' in lib);
	ok('isNumber' in lib);
	ok('isObjectOf' in lib);
	ok('isOptional' in lib);
	ok('isStrictObjectOf' in lib);
	ok('isString' in lib);
	ok('isSymbol' in lib);
	ok('isTupleOf' in lib);
	ok('isUnionOf' in lib);
	ok('parseAny' in lib);
	ok('parseAnyNumber' in lib);
	ok('parseArrayOf' in lib);
	ok('parseBigInt' in lib);
	ok('parseBoolean' in lib);
	ok('parseInstanceOf' in lib);
	ok('parseIntersectionOf' in lib);
	ok('parseLiteral' in lib);
	ok('parseLiteralOf' in lib);
	ok('parseNumber' in lib);
	ok('parseObjectOf' in lib);
	ok('parseOptional' in lib);
	ok('parseStrictObjectOf' in lib);
	ok('parseString' in lib);
	ok('parseSymbol' in lib);
	ok('parseTupleOf' in lib);
	ok('parseUnionOf' in lib);
	end();
});