import { test, equal, notOk, ok, throws } from 'tap';
import {
	isBoolean,
	isOptional,
	isOptionalUndefined,
	isString,
	isTupleOf,
	isTupleRestOf,
	tuple,
	tupleRest
} from 'r-assign';

test('isTupleOf', ({ end }) => {

	const isEmptyTuple = isTupleOf([]);

	equal(isTupleOf, tuple);

	ok(isEmptyTuple([]));
	notOk(isEmptyTuple([undefined]));

	const isTupleOfS = isTupleOf([isString]);

	ok(isTupleOfS(['abc']));
	notOk(isTupleOfS([]));

	const isTupleOfO = isTupleOf([isOptional(isString)]);

	ok(isTupleOfO(['abc']));
	ok(isTupleOfO([]));
	notOk(isTupleOfO([undefined]));

	const isTupleOfU = isTupleOf([isOptionalUndefined(isString)]);

	ok(isTupleOfU(['abc']));
	ok(isTupleOfU([]));
	ok(isTupleOfU([undefined]));
	notOk(isTupleOfU([null]));

	const isTupleOfSSS = isTupleOf([isString, isString, isString]);

	ok(isTupleOfSSS(['abc', 'def', 'ghi']));
	notOk(isTupleOfSSS([]));
	notOk(isTupleOfSSS(['abc']));
	notOk(isTupleOfSSS(['abc', 'def']));
	notOk(isTupleOfSSS(['abc', 'def', 'ghi', 'jkl']));

	const isTupleOfSSO = isTupleOf([isString, isString, isOptional(isString)]);

	ok(isTupleOfSSO(['abc', 'def', 'ghi']));
	ok(isTupleOfSSO(['abc', 'def']));
	notOk(isTupleOfSSO(['abc', 'def', undefined]));

	const isTupleOfSSU = isTupleOf([
		isString,
		isString,
		isOptionalUndefined(isString)
	]);

	ok(isTupleOfSSU(['abc', 'def', 'ghi']));
	ok(isTupleOfSSU(['abc', 'def']));
	ok(isTupleOfSSU(['abc', 'def', undefined]));
	notOk(isTupleOfSSU(['abc', 'def', null]));

	const isTupleOfSOO = isTupleOf([
		isString,
		isOptional(isString),
		isOptional(isString)
	]);

	ok(isTupleOfSOO(['abc', 'def', 'ghi']));
	ok(isTupleOfSOO(['abc', 'def']));
	ok(isTupleOfSOO(['abc']));
	notOk(isTupleOfSSO(['abc', 'def', undefined]));
	notOk(isTupleOfSOO(['abc', undefined, undefined]));

	const isTupleOfSOU = isTupleOf([
		isString,
		isOptional(isString),
		isOptionalUndefined(isString)
	]);

	ok(isTupleOfSOU(['abc', 'def', 'ghi']));
	ok(isTupleOfSOU(['abc', 'def']));
	ok(isTupleOfSOU(['abc', 'def', undefined]));
	ok(isTupleOfSOU(['abc']));
	notOk(isTupleOfSOU(['abc', undefined]));

	const isTupleOfSUU = isTupleOf([
		isString,
		isOptionalUndefined(isString),
		isOptionalUndefined(isString)
	]);

	ok(isTupleOfSUU(['abc', 'def', 'ghi']));
	ok(isTupleOfSUU(['abc', 'def']));
	ok(isTupleOfSUU(['abc', 'def', undefined]));
	ok(isTupleOfSUU(['abc', undefined, undefined]));
	ok(isTupleOfSUU(['abc', undefined]));
	ok(isTupleOfSUU(['abc']));
	notOk(isTupleOfSUU(['abc', null, null]));

	const isTupleOfOOO = isTupleOf([
		isOptional(isString),
		isOptional(isString),
		isOptional(isString)
	]);

	ok(isTupleOfOOO(['abc', 'def', 'ghi']));
	ok(isTupleOfOOO(['abc', 'def']));
	ok(isTupleOfOOO(['abc']));
	ok(isTupleOfOOO([]));

	const isTupleOfOOU = isTupleOf([
		isOptional(isString),
		isOptional(isString),
		isOptionalUndefined(isString)
	]);

	ok(isTupleOfOOU(['abc', 'def', 'ghi']));
	ok(isTupleOfOOU(['abc', 'def', undefined]));
	ok(isTupleOfOOU(['abc', 'def']));
	ok(isTupleOfOOU(['abc']));
	ok(isTupleOfOOU([]));
	notOk(isTupleOfOOU(['abc', 'def', null]));

	const isTupleOfOUO = isTupleOf([
		isOptional(isString),
		isOptionalUndefined(isString),
		isOptional(isString)
	]);

	ok(isTupleOfOUO(['abc', 'def', 'ghi']));
	ok(isTupleOfOUO(['abc', undefined, 'def']));
	ok(isTupleOfOUO(['abc', 'def']));
	ok(isTupleOfOUO(['abc', undefined]));
	ok(isTupleOfOUO(['abc']));
	ok(isTupleOfOUO([]));
	notOk(isTupleOfOUO(['abc', null, 'def']));
	notOk(isTupleOfOUO(['abc', null]));

	const isTupleOfOUU = isTupleOf([
		isOptional(isString),
		isOptionalUndefined(isString),
		isOptionalUndefined(isString)
	]);

	ok(isTupleOfOUU(['abc', 'def', 'ghi']));
	ok(isTupleOfOUU(['abc', 'def', undefined]));
	ok(isTupleOfOUU(['abc', undefined, undefined]));
	ok(isTupleOfOUU(['abc', 'def']));
	ok(isTupleOfOUU(['abc', undefined]));
	ok(isTupleOfOUU(['abc']));
	ok(isTupleOfOUU([]));
	notOk(isTupleOfOUU(['abc', 'def', null]));
	notOk(isTupleOfOUU(['abc', null]));

	const isTupleOfUOO = isTupleOf([
		isOptionalUndefined(isString),
		isOptional(isString),
		isOptional(isString)
	]);

	ok(isTupleOfUOO(['abc', 'def', 'ghi']));
	ok(isTupleOfUOO([undefined, 'abc', 'def']));
	ok(isTupleOfUOO(['abc', 'def']));
	ok(isTupleOfUOO([undefined, 'abc']));
	ok(isTupleOfUOO(['abc']));
	ok(isTupleOfUOO([undefined]));
	ok(isTupleOfUOO([]));
	notOk(isTupleOfUOO([null, 'abc', 'def']));
	notOk(isTupleOfUOO([null, 'abc']));
	notOk(isTupleOfUOO([null]));

	const isTupleOfUOU = isTupleOf([
		isOptionalUndefined(isString),
		isOptional(isString),
		isOptionalUndefined(isString)
	]);

	ok(isTupleOfUOU(['abc', 'def', 'ghi']));
	ok(isTupleOfUOU([undefined, 'abc', 'def']));
	ok(isTupleOfUOU([undefined, 'abc', undefined]));
	ok(isTupleOfUOU(['abc', 'def']));
	ok(isTupleOfUOU([undefined, 'abc']));
	ok(isTupleOfUOU(['abc']));
	ok(isTupleOfUOU([undefined]));
	ok(isTupleOfUOU([]));
	notOk(isTupleOfUOU([null, 'abc', 'def']));
	notOk(isTupleOfUOU([null, 'abc', null]));
	notOk(isTupleOfUOU([null, 'abc']));
	notOk(isTupleOfUOU([null]));

	const isTupleOfUUU = isTupleOf([
		isOptionalUndefined(isString),
		isOptionalUndefined(isString),
		isOptionalUndefined(isString)
	]);

	ok(isTupleOfUUU(['abc', 'def', 'ghi']));
	ok(isTupleOfUUU(['abc', 'def', undefined]));
	ok(isTupleOfUUU(['abc', undefined, 'def']));
	ok(isTupleOfUUU(['abc', undefined, undefined]));
	ok(isTupleOfUUU([undefined, 'abc', 'def']));
	ok(isTupleOfUUU([undefined, 'abc', undefined]));
	ok(isTupleOfUUU([undefined, undefined, undefined]));
	ok(isTupleOfUUU(['abc', 'def']));
	ok(isTupleOfUUU(['abc', undefined]));
	ok(isTupleOfUUU([undefined, 'abc']));
	ok(isTupleOfUUU([undefined, undefined]));
	ok(isTupleOfUUU(['abc']));
	ok(isTupleOfUUU([undefined]));
	ok(isTupleOfUUU([]));
	notOk(isTupleOfUUU(['abc', 'def', null]));
	notOk(isTupleOfUUU(['abc', null, 'def']));
	notOk(isTupleOfUUU(['abc', null, null]));
	notOk(isTupleOfUUU([null, 'abc', 'def']));
	notOk(isTupleOfUUU([null, 'abc', null]));
	notOk(isTupleOfUUU([null, null, null]));
	notOk(isTupleOfUUU(['abc', null]));
	notOk(isTupleOfUUU([null, 'abc']));
	notOk(isTupleOfUUU([null, null]));
	notOk(isTupleOfUUU([null]));

	throws(() => {
		// @ts-expect-error
		isTupleOf();
	}, TypeError('Invalid type guards provided'));

	throws(() => {
		// @ts-expect-error
		isTupleOf([null]);
	}, TypeError('Invalid type guard provided'));

	throws(() => {
		isTupleOf([
			isString,
			isOptional(isString),
			isString
		]);
	}, TypeError('A required element cannot follow an optional element'));

	throws(() => {
		isTupleOf([
			isOptional(isString),
			isOptional(isString),
			isString
		]);
	}, TypeError('A required element cannot follow an optional element'));

	throws(() => {
		isTupleOf([
			isOptional(isString),
			isString,
			isString
		]);
	}, TypeError('A required element cannot follow an optional element'));

	throws(() => {
		isTupleOf([
			isString,
			isOptionalUndefined(isString),
			isString
		]);
	}, TypeError('A required element cannot follow an optional element'));

	throws(() => {
		isTupleOf([
			isOptionalUndefined(isString),
			isOptionalUndefined(isString),
			isString
		]);
	}, TypeError('A required element cannot follow an optional element'));

	throws(() => {
		isTupleOf([
			isOptionalUndefined(isString),
			isString,
			isString
		]);
	}, TypeError('A required element cannot follow an optional element'));

	throws(() => {
		isTupleOf([
			isOptional(isString, '')
		]);
	}, TypeError('Tuple optional type cannot have default values'));

	throws(() => {
		isTupleOf([
			isOptionalUndefined(isString, '')
		]);
	}, TypeError('Tuple optional type cannot have default values'));

	end();
});

test('isTupleRestOf', ({ end }) => {

	equal(isTupleRestOf, tupleRest);

	ok(isTupleOf([isTupleRestOf(isString)])([]));

	ok(isTupleOf([isBoolean, isTupleRestOf(isString)])([true]));
	ok(isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 'abc']));
	ok(isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 'abc', 'def']));
	notOk(isTupleOf([isBoolean, isTupleRestOf(isString)])([true, 0]));

	ok(isTupleOf([isTupleRestOf(isString), isBoolean])([true]));
	ok(isTupleOf([isTupleRestOf(isString), isBoolean])(['abc', true]));
	ok(isTupleOf([isTupleRestOf(isString), isBoolean])(['abc', 'def', true]));
	notOk(isTupleOf([isTupleRestOf(isString), isBoolean])([0, true]));

	ok(
		isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
			true,
			false
		])
	);
	ok(
		isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
			'abc',
			true,
			false
		])
	);
	ok(
		isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
			'abc',
			'def',
			true,
			false
		])
	);
	notOk(
		isTupleOf([isTupleRestOf(isString), isBoolean, isBoolean])([
			0,
			true,
			false
		])
	);

	ok(isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([]));
	ok(isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([true]));
	ok(
		isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([
			true,
			'abc'
		])
	);
	ok(
		isTupleOf([isOptional(isBoolean), isTupleRestOf(isString)])([
			true,
			'abc',
			'def'
		])
	);

	ok(
		isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([])
	);
	ok(
		isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
			undefined
		])
	);
	ok(
		isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
			true
		])
	);
	ok(
		isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
			true,
			'abc'
		])
	);
	ok(
		isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
			undefined,
			'abc'
		])
	);
	ok(
		isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
			true,
			'abc',
			'def'
		])
	);
	ok(
		isTupleOf([isOptionalUndefined(isBoolean), isTupleRestOf(isString)])([
			undefined,
			'abc',
			'def'
		])
	);

	throws(() => {
		// @ts-expect-error
		isTupleRestOf(isTupleRestOf(isString));
	}, TypeError('Invalid use of tuple rest'));

	throws(() => {
		isTupleOf([isTupleRestOf(isString), isOptional(isString)]);
	}, TypeError('An optional element cannot follow a rest element'));

	throws(() => {
		isTupleOf([isTupleRestOf(isString), isOptionalUndefined(isString)]);
	}, TypeError('An optional element cannot follow a rest element'));

	throws(() => {
		isTupleOf([isTupleRestOf(isString), isTupleRestOf(isString)]);
	}, TypeError('A rest element cannot follow another rest element'));

	end();
});