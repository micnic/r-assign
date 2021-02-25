'use strict';

const { test } = require('tap');
const lib = require('r-assign/lib');

test('rAssign lib exports', ({ end, ok }) => {
	ok('isBoolean' in lib);
	ok('isAny' in lib);
	ok('isNumber' in lib);
	ok('isString' in lib);
	ok('isTypeOf' in lib);
	ok('useAny' in lib);
	ok('useBoolean' in lib);
	ok('useNumber' in lib);
	ok('useOptional' in lib);
	ok('useString' in lib);
	ok('useTypeOf' in lib);
	ok('useValidation' in lib);
	ok('validateAny' in lib);
	ok('validateBoolean' in lib);
	ok('validateNumber' in lib);
	ok('validateString' in lib);
	end();
});