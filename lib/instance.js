'use strict';

const {
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

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

const invalidConstructor = 'Invalid constructor provided';

/**
 * Check for instance values
 * @template {Instance<any>} T
 * @param {T} instance
 * @returns {TypeGuard<InferInstance<T>>}
 */
const isInstanceOf = (instance) => {

	// Check for valid type guard
	if (typeof instance !== 'function') {
		throw TypeError(invalidConstructor);
	}

	/** @type {TypeGuard<InferInstance<T>>} */
	const check = (value) => {

		return value instanceof instance;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation: instance.name,
		classification: 'instance',
		description: `an instance of ${instance.name}`
	});

	return check;
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
		throw TypeError(invalidPropertyType(check, true, initial));
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
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return value;
	};
};

module.exports = {
	getInstanceOf,
	isInstanceOf,
	parseInstanceOf
};