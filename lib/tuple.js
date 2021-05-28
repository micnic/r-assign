'use strict';

const {
	getTypeGuardMeta,
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

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

const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least one expected';

/**
 * Get the minimum length of the provided tuple
 * @template {Tuple<any>} T
 * @param {T} tuple
 * @returns {number}
 */
const getMinTupleLength = (tuple) => {

	return tuple.reduce((min, type, index) => {

		const { classification } = getTypeGuardMeta(type);

		// Check for optional type guard
		if (classification === 'optional') {
			return min;
		}

		return index + 1;
	}, 0);
};

/**
 * Get tuple annotation
 * @param {Tuple<any>} tuple
 * @param {number} min
 * @returns {string}
 */
const getTupleAnnotation = (tuple, min) => {

	return `[ ${tuple.map((type, index) => {

		const { annotation, classification } = getTypeGuardMeta(type);

		// Check for tail optional type guards
		if (classification === 'optional' && index >= min) {
			return `${annotation}?`;
		}

		return annotation;
	}).join(', ')} ]`;
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
		throw TypeError(invalidTypeGuards);
	}

	// Check for less than one type guard
	if (tuple.length < 1) {
		throw TypeError(notEnoughTypeGuards);
	}

	const max = tuple.length;
	const min = getMinTupleLength(tuple);
	const annotation = getTupleAnnotation(tuple, min);

	/** @type {TypeGuard<InferTuple<T>>} */
	const check = (value) => {

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

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'tuple',
		description: `a tuple of ${annotation}`
	});

	return check;
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
		throw TypeError(invalidPropertyType(check, true, initial));
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
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return [ ...value ];
	};
};

module.exports = {
	getTupleOf,
	isTupleOf,
	parseTupleOf
};