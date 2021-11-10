'use strict';

const { test, ok } = require('tap');

const { isUndefined } = require('r-assign/lib/undefined');

test('isUndefined', ({ end }) => {

	ok(isUndefined());

	end();
});