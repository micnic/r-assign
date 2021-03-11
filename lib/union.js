'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').TypeChecker<T>} TypeChecker
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').ExtractTypeGuard<T>} ExtractTypeGuard
 */

const { isArray } = Array;

/**
 * Validate provided types
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 */
const validateTypes = (types) => {

	// Check for valid types provided
	if (!isArray(types) || types.length === 0) {
		throw new TypeError('Invalid type checks provided');
	}

	// Validate each type checker
	types.forEach((type) => {

		// Check for valid specific type
		if (typeof type !== 'function') {
			throw new TypeError('Invalid type check provided');
		}

		// Check for valid return value of type check
		if (typeof type() !== 'boolean') {
			throw new TypeError('Invalid return value of type check');
		}
	});
};

/**
 * Check for values of union types
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @param {any} value
 * @returns {value is ExtractTypeGuard<T>}
 */
const isUnionOf = (types, value) => {

	// Validate types before checking the value
	validateTypes(types);

	return types.some((type) => type(value));
};

/**
 * Creator of transform functions for validating union types
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const parseUnionOf = (...types) => {

	// Validate types before checking the value
	validateTypes(types);

	return (value, key) => {

		// Throw for invalid type values
		if (!isUnionOf(types, value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

/**
 * Creator of transform functions for union types values
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @param {ExtractTypeGuard<T>} initial
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const useUnionOf = (types, initial) => {

	// Check for default value to be of a valid type
	if (!isUnionOf(types, initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (isUnionOf(types, value)) {
			return value;
		}

		return initial;
	};
};

module.exports = { isUnionOf, parseUnionOf, useUnionOf, validateTypes };