'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferInstance<T>} InferInstance
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').Instance<T>} Instance
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidDefaultValue = 'Invalid default value';
const invalidTypeGuard = 'Invalid type guard provided';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property "${key}" has invalid type`;
};

/**
 * Check for instance values
 * @template {Instance<any>} T
 * @param {T} instance
 * @returns {TypeGuard<InferInstance<T>>}
 */
const isInstanceOf = (instance) => {

	// Check for valid type guard
	if (typeof instance !== 'function') {
		throw new TypeError(invalidTypeGuard);
	}

	/** @type {TypeGuard<InferInstance<T>>} */
	const result = (value) => {

		return value instanceof instance;
	};

	return result;
};

/**
 * Extract instance values
 * @template {Instance<any>} T
 * @param {T} instance
 * @param {InferInstance<T>} initial
 * @returns {TransformFunction<InferInstance<T>>}
 */
const getInstanceOf = (instance, initial) => {

	const check = isInstanceOf(instance);

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
 * Extract and validate instance values
 * @template {Instance<any>} T
 * @param {T} instance
 * @returns {TransformFunction<InferInstance<T>>}
 */
const parseInstanceOf = (instance) => {

	const check = isInstanceOf(instance);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return value;
	};
};

module.exports = {
	getInstanceOf,
	isInstanceOf,
	parseInstanceOf
};