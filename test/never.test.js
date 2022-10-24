'use strict';

const { test, equal, notOk } = require('tap');
const { isNever, never } = require('r-assign/lib/never');

test('isNever', ({ end }) => {
	equal(isNever, never);

	notOk(isNever());
	notOk(isNever(null));

	end();
});