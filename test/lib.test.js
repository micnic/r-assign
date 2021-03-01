'use strict';

const { test } = require('tap');
const lib = require('r-assign/lib');

test('rAssign lib exports', ({ end, ok }) => {
	ok('isBoolean' in lib);
	ok('isBigInt' in lib);
	ok('isAny' in lib);
	ok('isNumber' in lib);
	ok('isObject' in lib);
	ok('isString' in lib);
	ok('isSymbol' in lib);
	ok('isTypeOf' in lib);
	ok('useAny' in lib);
	ok('useArrayOf' in lib);
	ok('useArrayOfValidation' in lib);
	ok('useBigInt' in lib);
	ok('useBoolean' in lib);
	ok('useNumber' in lib);
	ok('useObject' in lib);
	ok('useObjectValidation' in lib);
	ok('useOptional' in lib);
	ok('useString' in lib);
	ok('useSymbol' in lib);
	ok('useTypeOf' in lib);
	ok('useValidation' in lib);
	ok('validateAny' in lib);
	ok('validateBigInt' in lib);
	ok('validateBoolean' in lib);
	ok('validateNumber' in lib);
	ok('validateString' in lib);
	ok('validateSymbol' in lib);
	end();
});