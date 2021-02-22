'use strict';

const tap = require('tap');
const { isString, useString } = require('r-assign/lib/string');

tap.test('isString', (test) => {
	test.ok(isString(''));
	test.notOk(isString());
	test.end();
});

tap.test('useString', (test) => {
	tap.test('No arguments', (t) => {
		const getString = useString();

		t.equal(getString(), '');
		t.equal(getString('data'), 'data');
		t.equal(getString(null), '');
		t.end();
	});

	tap.test('Default value provided', (t) => {
		const getString = useString('data');

		t.equal(getString(), 'data');
		t.equal(getString('data'), 'data');
		t.equal(getString(null), 'data');
		t.end();
	});

	tap.test('Invalid default value provided', (t) => {
		t.throws(() => {
			useString(null);
		});
		t.end();
	});

	test.end();
});