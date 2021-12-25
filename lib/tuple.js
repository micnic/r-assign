'use strict';

const {
	checkInvalidOptional
} = require('r-assign/lib/internal/check-invalid-optional');
const {
	invalidInitialValue,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { pickTuple } = require('r-assign/lib/internal/pick-value');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @template {Tuple} T
 * @typedef {import('r-assign/lib').InferTuple<T>} InferTuple
 */

const { isArray } = Array;

const invalidOptionalIndex = 'Optional element on invalid index';
const invalidTypeGuards = 'Invalid type guards provided';

/**
 * Find first optional type
 * @param {TypeGuard} type
 * @returns {boolean}
 */
const findOptional = (type) => {

	return getTypeGuardMeta(type).classification === 'optional';
};

/**
 * Find first required type
 * @param {TypeGuard} type
 * @returns {boolean}
 */
const findRequired = (type) => {

	return getTypeGuardMeta(type).classification !== 'optional';
};

/**
 * Get the minimum length of the provided tuple
 * @template {Tuple} T
 * @param {T} tuple
 * @returns {number}
 */
const getMinTupleLength = (tuple) => {

	const optional = tuple.findIndex(findOptional);

	// When no optional type is found, return the length of the tuple
	if (optional < 0) {
		return tuple.length;
	}

	// When required type is found after optional, throw error
	if (tuple.slice(optional).findIndex(findRequired) >= 0) {
		throw TypeError(invalidOptionalIndex);
	}

	return optional;
};

/**
 * Get tuple annotation
 * @param {Tuple} tuple
 * @returns {string}
 */
const getTupleAnnotation = (tuple) => {

	return `[ ${tuple.map((type) => {

		const { annotation, classification } = getTypeGuardMeta(type);

		// Check for tail optional type guards
		if (classification === 'optional') {
			return `${annotation}?`;
		}

		return annotation;
	}).join(', ')} ]`;
};

/**
 * Check for tuple values
 * @template {Tuple} T
 * @param {T} tuple
 * @returns {TypeGuard<InferTuple<T>>}
 */
const isTupleOf = (tuple) => {

	// Check for valid type guards provided
	if (!isArray(tuple)) {
		throw TypeError(invalidTypeGuards);
	}

	const max = tuple.length;
	const min = getMinTupleLength(tuple);
	const annotation = getTupleAnnotation(tuple);

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
		for (const [index, type] of tuple.entries()) {

			// Check for the end of the value
			if (index === length) {
				break;
			}

			const element = value[index];

			// Check current type guard
			if (checkInvalidOptional(type, element) || !type(element)) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'tuple',
		description: `a tuple of ${annotation}`,
		types: tuple
	});

	return check;
};

/**
 * Extract tuple values
 * @deprecated will be removed in version 2.0, use getType instead
 * @template {Tuple} T
 * @param {T} tuple
 * @param {InferTuple<T>} initial
 * @returns {TransformFunction<InferTuple<T>>}
 */
const getTupleOf = (tuple, initial) => {

	const check = isTupleOf(tuple);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickTuple(value, tuple);
		}

		return pickTuple(initial, tuple);
	};
};

/**
 * Extract and validate tuple values
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {Tuple} T
 * @param {T} tuple
 * @returns {TransformFunction<InferTuple<T>>}
 */
const parseTupleOf = (tuple) => {

	const check = isTupleOf(tuple);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return pickTuple(value, tuple);
	};
};

module.exports = {
	getTupleOf,
	isTupleOf,
	parseTupleOf
};