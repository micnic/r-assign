'use strict';

const { test } = require('tap');
const lib = require('r-assign/lib');

test('rAssign lib exports', ({ end, ok }) => {
	ok('isAny' in lib);
	ok('isBoolean' in lib);
	ok('isBigInt' in lib);
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
	ok('parseString' in lib);
	ok('parseSymbol' in lib);
	ok('parseUnionOf' in lib);
	ok('useAny' in lib);
	ok('useArrayOf' in lib);
	ok('useBigInt' in lib);
	ok('useBoolean' in lib);
	ok('useLiteral' in lib);
	ok('useNumber' in lib);
	ok('useObjectOf' in lib);
	ok('parseObjectOf' in lib);
	ok('useOptional' in lib);
	ok('useString' in lib);
	ok('useSymbol' in lib);
	ok('useUnionOf' in lib);
	end();
});