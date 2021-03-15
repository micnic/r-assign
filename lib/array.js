'use strict';

const { isUnionOf } = require('r-assign/lib/union');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').ExtractTypeGuard<T>} ExtractTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').TypeGuard<T>} TypeGuard
 */

const { isArray } = Array;

/**
 * Check for array values
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @returns {TypeGuard<ExtractTypeGuard<T>[]>}
 */
const isArrayOf = (...types) => {

	const check = isUnionOf(...types);

	/** @type {TypeGuard<ExtractTypeGuard<T>[]>} */
	const result = (value) => {

		// Check for non-array values
		if (!isArray(value)) {
			return false;
		}

		return value.every((element) => check(element));
	};

	return result;
};

/**
 * Creator of transform functions for array validation
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @returns {TransformFunction<ExtractTypeGuard<T>[]>}
 */
const parseArrayOf = (...types) => {

	const check = isArrayOf(...types);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

/**
 * Creator of transform functions for array values
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @param {ExtractTypeGuard<T>[]} [initial]
 * @returns {TransformFunction<ExtractTypeGuard<T>[]>}
 */
const useArrayOf = (types, initial = []) => {

	const check = isArrayOf(...types);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return value;
		}

		return initial;
	};
};

module.exports = {
	isArrayOf,
	parseArrayOf,
	useArrayOf
};