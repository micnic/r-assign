'use strict';

const { test, match, throws } = require('tap');
const rAssign = require('r-assign');

test('No arguments', ({ end }) => {
	throws(() => {
		rAssign();
	});
	end();
});

test('Invalid schema', ({ end }) => {
	throws(() => {
		rAssign({ data: null });
	});
	end();
});

test('Schema with skipped property', ({ end }) => {
	match(rAssign({ data: () => {/* Return nothing */} }), {});
	end();
});

test('Schema with one property', ({ end }) => {
	match(rAssign({ data: () => null }), { data: null });
	end();
});

test('Schema with inherited properties', ({ end }) => {
	const schema = Object.create({ prop: false });

	schema.data = () => null;

	match(rAssign(schema), { data: null });
	end();
});

test('Schema with object applied', ({ end }) => {
	match(rAssign({
		data: (value) => value
	}, { data: 'data' }), { data: 'data' });
	end();
});

test('Schema with object applied, property skipped', ({ end }) => {
	match(rAssign({
		data: () => {/* Return nothing */}
	}, { data: 'data' }), {});
	end();
});

test('Schema with two objects applied', ({ end }) => {
	match(rAssign({
		data: (value) => value
	}, { data: 'data' }, { data: 'data2' }), { data: 'data2' });
	end();
});

test('Schema with two objects applied, property skipped', ({ end }) => {
	match(rAssign({
		data: () => {/* Return nothing */}
	}, { data: 'data' }, { data: 'data2' }), {});
	end();
});