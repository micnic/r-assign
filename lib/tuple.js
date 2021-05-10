'use strict';

/**
* @template T
* @typedef {import('r-assign').TransformFunction<T>} TransformFunction
*/

/**
* @template T
* @typedef {import('r-assign/lib').InferTuple<T>} InferTuple
*/

/**
* @template T
* @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
*/

/**
* @template T
* @typedef {import('r-assign/lib').Tuple<T>} Tuple
*/

/**
* @template T
* @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
*/

const { isArray } = Array;

const invalidDefaultValue = 'Invalid default value';
const invalidTypeGuard = 'Invalid type guard provided';
const invalidTypeGuardReturn = 'Invalid return value of type guard';
const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least one expected';

/**
 * Get the minimum length of the provided tuple
 * @template {Tuple<any>} T
 * @param {T} tuple
 * @returns {number}
 */
const getMinTupleLength = (tuple) => {

	const { length } = tuple;

	// Loop through the type guards of the tuple
	for (const index of tuple.keys()) {

		const min = length - index;

		// Check for optional type guard
		if (!tuple[min - 1]()) {
			return min;
		}
	}

	return 0;
};

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property "${key}" has invalid type`;
};

/**
 * Check for tuple values
 * @template {Tuple<any>} T
 * @param {T} tuple
 * @returns {TypeGuard<InferTuple<T>>}
 */
const isTupleOf = (tuple) => {

	// Check for valid type guards provided
	if (!isArray(tuple)) {
		throw new TypeError(invalidTypeGuards);
	}

	// Check for less than one type guard
	if (tuple.length < 1) {
		throw new TypeError(notEnoughTypeGuards);
	}

	// Validate each type guard
	for (const type of tuple) {

		// Check for valid type guard
		if (typeof type !== 'function') {
			throw new TypeError(invalidTypeGuard);
		}

		// Check for valid return value of type guard
		if (typeof type() !== 'boolean') {
			throw new TypeError(invalidTypeGuardReturn);
		}
	}

	const max = tuple.length;
	const min = getMinTupleLength(tuple);

	/** @type {TypeGuard<InferTuple<T>>} */
	const result = (value) => {

		// Check for non-array values or invalid array length
		if (!isArray(value)) {
			return false;
		}

		const { length } = value;

		// Check for valid value length
		if (length < min || length > max) {
			return false;
		}

		// Loop tuple type guards and check them
		for (const index of tuple.keys()) {

			// Check for the end of the value
			if (index === length) {
				break;
			}

			// Check current type guard
			if (!tuple[index](value[index])) {
				return false;
			}
		}

		return true;
	};

	return result;
};

/**
 * Extract tuple values
 * @template {Tuple<any>} T
 * @param {T} tuple
 * @param {InferTuple<T>} initial
 * @returns {TransformFunction<InferTuple<T>>}
 */
const getTupleOf = (tuple, initial) => {

	const check = isTupleOf(tuple);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return [ ...value ];
		}

		return [ ...initial ];
	};
};

/**
 * Extract and validate tuple values
 * @template {Tuple<any>} T
 * @param {T} tuple
 * @returns {TransformFunction<InferTuple<T>>}
 */
const parseTupleOf = (tuple) => {

	const check = isTupleOf(tuple);

	return (value, key) => {

		// Return the valid values or the default value
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return [ ...value ];
	};
};

module.exports = {
	getTupleOf,
	isTupleOf,
	parseTupleOf
};