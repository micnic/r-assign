'use strict';

const tap = require('tap');
const { isNumber, useNumber } = require('r-assign/lib/number');

tap.test('isNumber', (test) => {
	test.ok(isNumber(0));
	test.notOk(isNumber(NaN));
	test.notOk(isNumber(Infinity));
	test.notOk(isNumber(-Infinity));
	test.notOk(isNumber());

	test.end();
});

tap.test('useNumber', (test) => {
	tap.test('No arguments', (t) => {
		const getNumber = useNumber();

		t.equal(getNumber(), 0);
		t.equal(getNumber(1), 1);
		t.equal(getNumber(null), 0);
		t.equal(getNumber(NaN), 0);
		t.equal(getNumber(Infinity), 0);
		t.equal(getNumber(-Infinity), 0);
		t.end();
	});

	tap.test('Default value provided', (t) => {
		const getNumber = useNumber(1);

		t.equal(getNumber(), 1);
		t.equal(getNumber(1), 1);
		t.equal(getNumber(null), 1);
		t.equal(getNumber(NaN), 1);
		t.equal(getNumber(Infinity), 1);
		t.equal(getNumber(-Infinity), 1);
		t.end();
	});

	tap.test('Invalid default value provided', (t) => {
		t.throws(() => {
			useNumber(null);
		});
		t.throws(() => {
			useNumber(NaN);
		});
		t.throws(() => {
			useNumber(Infinity);
		});
		t.throws(() => {
			useNumber(-Infinity);
		});
		t.end();
	});

	test.end();
});