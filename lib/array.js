'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').ExtractTypeGuard<T>} ExtractTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { isArray } = Array;

const invalidDefaultValue = 'Invalid default value';
const invalidTypeCheck = 'Invalid type check provided';
const invalidTypeCheckReturn = 'Invalid return value of type check';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property ${key} has invalid type`;
};

/**
 * Check for array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<ExtractTypeGuard<T>[]>}
 */
const isArrayOf = (type) => {

	// Check for valid type check
	if (typeof type !== 'function') {
		throw new TypeError(invalidTypeCheck);
	}

	// Check for valid return value of type check
	if (typeof type() !== 'boolean') {
		throw new TypeError(invalidTypeCheckReturn);
	}

	/** @type {TypeGuard<ExtractTypeGuard<T>[]>} */
	const result = (value) => {

		// Check for non-array values
		if (!isArray(value)) {
			return false;
		}

		return value.every((element) => type(element));
	};

	return result;
};

/**
 * Creator of transform functions for array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @param {ExtractTypeGuard<T>[]} [initial]
 * @returns {TransformFunction<ExtractTypeGuard<T>[]>}
 */
const getArrayOf = (type, initial = []) => {

	const check = isArrayOf(type);

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
 * Creator of transform functions for array validation
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TransformFunction<ExtractTypeGuard<T>[]>}
 */
const parseArrayOf = (type) => {

	const check = isArrayOf(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return value;
	};
};

module.exports = {
	getArrayOf,
	isArrayOf,
	parseArrayOf
};