'use strict';

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

/**
 * Check for optional values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<ExtractTypeGuard<T> | undefined>}
 */
const isOptional = (type) => {

	// Check for valid type check
	if (typeof type !== 'function') {
		throw new TypeError('Invalid type check provided');
	}

	// Check for valid return value of type check
	if (typeof type() !== 'boolean') {
		throw new TypeError('Invalid return value of type check');
	}

	/** @type {TypeGuard<ExtractTypeGuard<T> | undefined>} */
	const result = (value) => {

		// Check for non-array values
		if (typeof value === 'undefined') {
			return true;
		}

		return type(value);
	};

	return result;
};

/**
 * Creator of transform functions for optional values
 * @template {TransformFunction<any>} T
 * @param {T} transform
 * @returns {TransformFunction<ReturnType<T> | undefined>}
 */
const getOptional = (transform) => {

	// Check for provided transform function
	if (typeof transform !== 'function') {
		throw new TypeError('Invalid transform function provided');
	}

	return (value, key, source) => {

		// Check for undefined values to accept them
		if (typeof value === 'undefined') {
			return value;
		}

		return transform(value, key, source);
	};
};

/**
 * Creator of transform functions for array validation
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TransformFunction<ExtractTypeGuard<T> | undefined>}
 */
const parseOptional = (type) => {

	const check = isOptional(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

module.exports = {
	getOptional,
	isOptional,
	parseOptional
};