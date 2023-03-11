import { test, match, throws } from 'tap';
import rAssign, { isString } from 'r-assign';

const expectedFunction = 'expected to be a function';
const invalidProperty = 'Invalid property type';
const invalidValue = 'Invalid value type';

test('No arguments', ({ end }) => {
	throws(() => {
		// @ts-expect-error
		rAssign();
	}, TypeError('Invalid schema argument type, object expected'));
	end();
});

test('Invalid type guard schema', ({ end }) => {
	throws(() => {
		// @ts-expect-error
		rAssign(() => true, null);
	}, TypeError('Invalid type guard provided'));
	end();
});

test('Invalid object schema', ({ end }) => {
	throws(() => {
		// @ts-expect-error
		rAssign({ data: null }, null);
	}, TypeError(`${invalidProperty}, "data" property ${expectedFunction}`));
	end();
});

test('Type guard schema with with invalid input', ({ end }) => {
	throws(() => {
		rAssign(isString, null);
	}, TypeError(`${invalidValue}, expected a string value but received null`));
	end();
});

test('Type guard schema with with valid input', ({ end }) => {
	match(rAssign(isString, 'data'), 'data');
	end();
});

test('Schema with skipped property', ({ end }) => {
	match(rAssign({ data: () => {/* Return nothing */} }, {}), {});
	end();
});

test('Schema with one property', ({ end }) => {
	match(rAssign({ data: () => null }, {}), { data: null });
	end();
});

test('Schema with inherited properties', ({ end }) => {
	const schema = Object.create({ prop: false });

	schema.data = () => null;

	match(rAssign(schema, {}), { data: null });
	end();
});

test('Schema with object applied', ({ end }) => {
	match(rAssign({
		data: (value) => value
	}, { data: 'data' }), { data: 'data' });
	end();
});

test('Schema with null applied', ({ end }) => {
	match(rAssign({
		data: (value) => value
	}, null), {});
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