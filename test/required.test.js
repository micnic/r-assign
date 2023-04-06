import { test, equal, notOk, ok, throws } from 'tap';
import {
	isObjectOf,
	isOptional,
	isOptionalUndefined,
	isRequired,
	isString,
	isTupleOf,
	required
} from 'r-assign';

test('isRequired', ({ end }) => {

	equal(isRequired, required);

	ok(isRequired(isObjectOf({ a: isOptional(isString) }))({ a: 'abc' }));
	notOk(
		isRequired(isObjectOf({ a: isOptional(isString) }))({ a: undefined })
	);
	notOk(isRequired(isObjectOf({ a: isOptional(isString) }))({}));

	ok(
		isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
			a: 'abc'
		})
	);
	notOk(
		isRequired(isObjectOf({ a: isOptionalUndefined(isString) }))({
			a: undefined
		})
	);
	notOk(isRequired(isObjectOf({ a: isString }))({}));

	ok(isRequired(isObjectOf({ a: isString }))({ a: 'abc' }));
	notOk(
		isRequired(isObjectOf({ a: isString }))({ a: undefined })
	);
	notOk(isRequired(isObjectOf({ a: isString }))({}));

	ok(
		isRequired(isObjectOf({ a: isOptional(isString) }, true))({
			a: 'abc'
		})
	);
	notOk(
		isRequired(isObjectOf({ a: isOptional(isString) }, true))({
			a: undefined
		})
	);
	notOk(isRequired(isObjectOf({ a: isOptional(isString) }, true))({}));

	ok(
		isRequired(isObjectOf({ a: isOptionalUndefined(isString) }, true))(
			{
				a: 'abc'
			}
		)
	);
	notOk(
		isRequired(isObjectOf({ a: isOptionalUndefined(isString) }, true))(
			{
				a: undefined
			}
		)
	);
	notOk(isRequired(isObjectOf({ a: isString }, true))({}));

	ok(isRequired(isObjectOf({ a: isString }, true))({ a: 'abc' }));
	notOk(
		isRequired(isObjectOf({ a: isString }, true))({ a: undefined })
	);
	notOk(isRequired(isObjectOf({ a: isString }, true))({}));

	ok(isRequired(isTupleOf([isOptional(isString)]))(['abc']));
	notOk(isRequired(isTupleOf([isOptional(isString)]))([undefined]));
	notOk(isRequired(isTupleOf([isOptional(isString)]))([]));

	ok(isRequired(isTupleOf([isOptionalUndefined(isString)]))(['abc']));
	notOk(isRequired(isTupleOf([isOptionalUndefined(isString)]))([undefined]));
	notOk(isRequired(isTupleOf([isOptionalUndefined(isString)]))([]));

	ok(isRequired(isTupleOf([isString]))(['abc']));
	notOk(isRequired(isTupleOf([isString]))([undefined]));
	notOk(isRequired(isTupleOf([isString]))([]));

	throws(() => {
		// @ts-expect-error
		isRequired();
	}, TypeError);

	throws(() => {
		// @ts-expect-error
		isRequired(isString);
	}, TypeError);

	end();
});