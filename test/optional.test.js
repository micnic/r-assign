import { test, equal, throws } from 'tap';
import rAssign, {
	isOptional,
	isOptionalUndefined,
	isString,
	optional,
	optionalUndef
} from 'r-assign';

test('isOptional', ({ end }) => {

	equal(isOptional, optional);

	throws(() => {
		// @ts-expect-error
		isOptional();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isOptional(isOptional(isString));
	}, TypeError('Invalid use of optional type'));

	throws(() => {
		isOptional(isString, '')();
	}, TypeError);

	end();
});

test('assign isOptional', ({ end }) => {

	throws(() => {
		// @ts-expect-error
		rAssign(isOptional(isString));
	});

	end();
});

test('isOptionalUndefined', ({ end }) => {

	equal(isOptionalUndefined, optionalUndef);

	throws(() => {
		// @ts-expect-error
		isOptionalUndefined();
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		// @ts-expect-error
		isOptionalUndefined(isOptionalUndefined(isString));
	}, TypeError('Invalid use of optional type'));

	end();
});

test('assign isOptionalUndefined', ({ end }) => {

	throws(() => {
		// @ts-expect-error
		rAssign(isOptionalUndefined(isString));
	});

	end();
});