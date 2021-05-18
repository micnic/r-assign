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
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidTransform = 'Invalid transform function provided';

/**
 * Check for optional values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T> | undefined>}
 */
const isOptional = (type) => {

	// Validate the provided type guard
	validateTypeGuard(type);

	/** @type {TypeGuard<InferTypeGuard<T> | undefined>} */
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
 * Extract optional values
 * @template {TransformFunction<any>} T
 * @param {T} transform
 * @returns {TransformFunction<ReturnType<T> | undefined>}
 */
const getOptional = (transform) => {

	// Check for provided transform function
	if (typeof transform !== 'function') {
		throw new TypeError(invalidTransform);
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
 * Extract and validate optional values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T> | undefined>}
 */
const parseOptional = (type) => {

	const check = isOptional(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return value;
	};
};

module.exports = {
	getOptional,
	isOptional,
	parseOptional
};