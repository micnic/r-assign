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
 * @template [C = any]
 * @typedef {import('r-assign/lib').Constructor<C>} Constructor
 */

/**
 * @template {Constructor} C
 * @typedef {import('r-assign/lib').InferC<C>} InferConstructor
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const invalidConstructor = 'Invalid constructor provided';

/**
 * Check for instance values
 * @template {Constructor} C
 * @param {C} constructor
 * @returns {TypeGuard<InferConstructor<C>>}
 */
const isInstanceOf = (constructor) => {

	// Check for valid type guard
	if (typeof constructor !== 'function') {
		throw TypeError(invalidConstructor);
	}

	/** @type {TypeGuard<InferConstructor<C>>} */
	const check = (value) => (value instanceof constructor);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation: constructor.name,
		classification: 'instance',
		constructor,
		description: `an instance of ${constructor.name}`
	});

	return check;
};

/**
 * Extract instance values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Constructor} C
 * @param {C} instance
 * @param {InferConstructor<C>} initial
 * @returns {TransformFunction<InferConstructor<C>>}
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
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Constructor} C
 * @param {C} instance
 * @returns {TransformFunction<InferConstructor<C>>}
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
	instance: isInstanceOf,
	isInstanceOf,
	parseInstanceOf
};