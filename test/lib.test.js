'use strict';

const { test } = require('tap');
const lib = require('r-assign/lib');

test('rAssign lib exports', ({ end, ok }) => {
	ok('getAny' in lib);
	ok('getArrayOf' in lib);
	ok('getBigInt' in lib);
	ok('getBoolean' in lib);
	ok('getLiteral' in lib);
	ok('getNumber' in lib);
	ok('getObjectOf' in lib);
	ok('getOptional' in lib);
	ok('getString' in lib);
	ok('getSymbol' in lib);
	ok('getUnionOf' in lib);
	ok('isAny' in lib);
	ok('isArrayOf' in lib);
	ok('isBigInt' in lib);
	ok('isBoolean' in lib);
	ok('isLiteral' in lib);
	ok('isNumber' in lib);
	ok('isObjectOf' in lib);
	ok('isString' in lib);
	ok('isSymbol' in lib);
	ok('isUnionOf' in lib);
	ok('parseAny' in lib);
	ok('parseArrayOf' in lib);
	ok('parseBigInt' in lib);
	ok('parseBoolean' in lib);
	ok('parseLiteral' in lib);
	ok('parseNumber' in lib);
	ok('parseObjectOf' in lib);
	ok('parseString' in lib);
	ok('parseSymbol' in lib);
	ok('parseUnionOf' in lib);
	end();
});