'use strict';

const tap = require('tap');
const { isBoolean, useBoolean } = require('r-assign/lib/boolean');

tap.test('isBoolean', (test) => {
	test.ok(isBoolean(false));
	test.ok(isBoolean(true));
	test.notOk(isBoolean());
	test.end();
});

tap.test('useBoolean', (test) => {
	tap.test('No arguments', (t) => {
		const getBoolean = useBoolean();

		t.equal(getBoolean(), false);
		t.equal(getBoolean(true), true);
		t.equal(getBoolean(false), false);
		t.equal(getBoolean(null), false);
		t.end();
	});

	tap.test('Default value provided', (t) => {
		const getBoolean = useBoolean(true);

		t.equal(getBoolean(), true);
		t.equal(getBoolean(true), true);
		t.equal(getBoolean(false), false);
		t.equal(getBoolean(null), true);
		t.end();
	});

	tap.test('Invalid default value provided', (t) => {
		t.throws(() => {
			useBoolean(null);
		});
		t.end();
	});

	test.end();
});