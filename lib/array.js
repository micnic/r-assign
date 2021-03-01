'use strict';

const { isTypeOf } = require('r-assign/lib/type');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/type').ExtractTypeGuard<T>} ExtractTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/type').TypeChecker<T>} TypeChecker
 */

const { isArray } = Array;

/**
 * Check for array values
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @param {any} value
 * @returns {value is ExtractTypeGuard<T>[]}
 */
const isArrayOf = (types, value) => {

	// Validate provided types
	isTypeOf(types);

	// Check for non-array values
	if (!isArray(value)) {
		return false;
	}

	return value.every((element) => isTypeOf(types, element));
};

/**
 * Creator of transform functions for array values
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @param {ExtractTypeGuard<T>[]} [initial]
 * @returns {TransformFunction<ExtractTypeGuard<T>[]>}
 */
const useArrayOf = (types, initial = []) => {

	// Check for default value to be of a valid type
	if (!isArrayOf(types, initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (isArrayOf(types, value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Creator of transform functions for array validation
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @returns {TransformFunction<ExtractTypeGuard<T>[]>}
 */
const useArrayOfValidation = (...types) => {

	// Validate provided types
	isTypeOf(types);

	return (value, key) => {

		// Throw for invalid type values
		if (!isArrayOf(types, value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

module.exports = {
	isArrayOf,
	useArrayOf,
	useArrayOfValidation
};