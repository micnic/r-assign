'use strict';

const { test } = require('tap');
const { useString } = require('r-assign/lib/string');
const {
	useOptional
} = require('r-assign/lib/type');

test('useOptional', ({ end, equals, throws }) => {

	const getOptionalString = useOptional(useString());

	equals(typeof getOptionalString(), 'undefined');
	equals(getOptionalString(''), '');
	equals(getOptionalString('data'), 'data');
	equals(getOptionalString(null), '');

	throws(() => {
		useOptional();
	});

	end();
});