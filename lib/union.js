'use strict';

const {
	invalidPropertyType,
	validateTypeGuard
} = require('r-assign/lib/common');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferUnion<T>} InferUnion
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').Union<T>} Union
 */

const { isArray } = Array;

const invalidDefaultValue = 'Invalid default value';
const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

/**
 * Check for union type values
 * @template {Union<any>} U
 * @param {U} union
 * @returns {TypeGuard<InferUnion<U>>}
 */
const isUnionOf = (union) => {

	// Check for valid type guards provided
	if (!isArray(union)) {
		throw new TypeError(invalidTypeGuards);
	}

	// Check for less than two type guards
	if (union.length <= 1) {
		throw new TypeError(notEnoughTypeGuards);
	}

	// Validate each type guard
	for (const type of union) {
		validateTypeGuard(type);
	}

	/** @type {TypeGuard<InferUnion<U>>} */
	const result = (value) => {

		// Check for at least one type guard in union
		for (const type of union) {
			if (type(value)) {
				return true;
			}
		}

		return false;
	};

	return result;
};

/**
 * Extract union type values
 * @template {Union<any>} U
 * @param {U} union
 * @param {InferUnion<U>} initial
 * @returns {TransformFunction<InferUnion<U>>}
 */
const getUnionOf = (union, initial) => {

	const check = isUnionOf(union);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate union type values
 * @template {Union<any>} U
 * @param {U} union
 * @returns {TransformFunction<InferUnion<U>>}
 */
const parseUnionOf = (union) => {

	const check = isUnionOf(union);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return value;
	};
};

module.exports = {
	getUnionOf,
	isUnionOf,
	parseUnionOf
};