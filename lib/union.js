'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').TypeGuard<T>} TypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').ExtractTypeGuard<T>} ExtractTypeGuard
 */

const { isArray } = Array;

/**
 * Validate provided types
 * @template {TypeGuard<any>} T
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
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @returns {TypeGuard<ExtractTypeGuard<T>>}
 */
const isUnionOf = (...types) => {

	// Validate types before checking the value
	validateTypes(types);

	/** @type {TypeGuard<ExtractTypeGuard<T>>} */
	const result = (value) => types.some((type) => type(value));

	return result;
};

/**
 * Creator of transform functions for union types values
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @param {ExtractTypeGuard<T>} initial
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const getUnionOf = (types, initial) => {

	const check = isUnionOf(...types);

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

/**
 * Creator of transform functions for validating union types
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const parseUnionOf = (...types) => {

	const check = isUnionOf(...types);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

module.exports = {
	getUnionOf,
	isUnionOf,
	parseUnionOf,
	validateTypes
};