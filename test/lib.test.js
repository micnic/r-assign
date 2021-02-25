'use strict';

const tap = require('tap');
const lib = require('r-assign/lib');

tap.test('rAssign lib exports', (test) => {
	test.ok('isAny' in lib);
	test.ok('isBoolean' in lib);
	test.ok('isNumber' in lib);
	test.ok('isString' in lib);
	test.ok('isTypeOf' in lib);
	test.ok('useAny' in lib);
	test.ok('useBoolean' in lib);
	test.ok('useNumber' in lib);
	test.ok('useOptional' in lib);
	test.ok('useString' in lib);
	test.ok('useTypeOf' in lib);
	test.ok('useValidation' in lib);
	test.ok('validateAny' in lib);
	test.end();
});