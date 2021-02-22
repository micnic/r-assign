'use strict';

const tap = require('tap');
const useNumber = require('r-assign/lib/use-number');

tap.test('No arguments', (test) => {
	const getNumber = useNumber();

	test.equal(getNumber(), 0);
	test.equal(getNumber(1), 1);
	test.equal(getNumber(null), 0);
	test.equal(getNumber(NaN), 0);
	test.equal(getNumber(Infinity), 0);
	test.equal(getNumber(-Infinity), 0);
	test.end();
});

tap.test('Default value provided', (test) => {
	const getNumber = useNumber(1);

	test.equal(getNumber(), 1);
	test.equal(getNumber(1), 1);
	test.equal(getNumber(null), 1);
	test.equal(getNumber(NaN), 1);
	test.equal(getNumber(Infinity), 1);
	test.equal(getNumber(-Infinity), 1);
	test.end();
});

tap.test('Invalid default value provided', (test) => {
	test.throws(() => {
		useNumber(null);
	});
	test.throws(() => {
		useNumber(NaN);
	});
	test.throws(() => {
		useNumber(Infinity);
	});
	test.throws(() => {
		useNumber(-Infinity);
	});
	test.end();
});