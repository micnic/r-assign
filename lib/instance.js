'use strict';

const {
	invalidInitialValue,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template [I = any]
 * @typedef {import('r-assign/lib').Instance<I>} Instance
 */

/**
 * @template {Instance} I
 * @typedef {import('r-assign/lib').InferInstance<I>} InferInstance
 */

const invalidConstructor = 'Invalid constructor provided';

/**
 * Check for instance values
 * @template {Instance} I
 * @param {I} constructor
 * @returns {TypeGuard<InferInstance<I>>}
 */
const isInstanceOf = (constructor) => {

	// Check for valid type guard
	if (typeof constructor !== 'function') {
		throw TypeError(invalidConstructor);
	}

	/** @type {TypeGuard<InferInstance<I>>} */
	const check = (value) => {

		return (value instanceof constructor);
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation: constructor.name,
		classification: 'instance',
		description: `an instance of ${constructor.name}`
	});

	return check;
};

/**
 * Extract instance values
 * @deprecated will be removed in version 2.0, use getType instead
 * @template {Instance} I
 * @param {I} instance
 * @param {InferInstance<I>} initial
 * @returns {TransformFunction<InferInstance<I>>}
 */
const getInstanceOf = (instance, initial) => {

	const check = isInstanceOf(instance);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
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
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {Instance} I
 * @param {I} instance
 * @returns {TransformFunction<InferInstance<I>>}
 */
const parseInstanceOf = (instance) => {

	const check = isInstanceOf(instance);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return value;
	};
};

module.exports = {
	getInstanceOf,
	isInstanceOf,
	parseInstanceOf
};