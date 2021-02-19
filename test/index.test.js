'use strict';

const tap = require('tap');
const rAssign = require('r-assign');

tap.test('No arguments', (test) => {
	test.throws(() => {
		rAssign();
	});
	test.end();
});

tap.test('Invalid schema', (test) => {
	test.throws(() => {
		rAssign({ data: null });
	});
	test.end();
});

tap.test('Schema with skipped property', (test) => {
	test.match(rAssign({ data: () => {/* Return nothing */} }), {});
	test.end();
});

tap.test('Schema with one property', (test) => {
	test.match(rAssign({ data: () => null }), { data: null });
	test.end();
});

tap.test('Schema with inherited properties', (test) => {
	const schema = Object.create({ prop: false });

	schema.data = () => null;

	test.match(rAssign(schema), { data: null });
	test.end();
});

tap.test('Schema with object applied', (test) => {
	test.match(rAssign({
		data: (value) => value
	}, { data: 'data' }), { data: 'data' });
	test.end();
});

tap.test('Schema with object applied, property skipped', (test) => {
	test.match(rAssign({
		data: () => {/* Return nothing */}
	}, { data: 'data' }), {});
	test.end();
});

tap.test('Schema with two objects applied', (test) => {
	test.match(rAssign({
		data: (value) => value
	}, { data: 'data' }, { data: 'data2' }), { data: 'data2' });
	test.end();
});

tap.test('Schema with two objects applied, property skipped', (test) => {
	test.match(rAssign({
		data: () => {/* Return nothing */}
	}, { data: 'data' }, { data: 'data2' }), {});
	test.end();
});