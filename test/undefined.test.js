'use strict';

const { test, equal, notOk, ok } = require('tap');

const { isUndefined, undef } = require('r-assign/lib/undefined');

test('isUndefined', ({ end }) => {

	equal(isUndefined, undef);

	ok(isUndefined());
	notOk(isUndefined(null));

	end();
});