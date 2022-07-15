'use strict';

const { invalidConstructor } = require('r-assign/lib/internal/errors');
const { getType } = require('r-assign/lib/get-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');

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
const getInstanceOf = (instance, initial) =>
	getType(isInstanceOf(instance), initial);

/**
 * Extract and validate instance values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Constructor} C
 * @param {C} instance
 * @returns {TransformFunction<InferConstructor<C>>}
 */
const parseInstanceOf = (instance) => parseType(isInstanceOf(instance));

module.exports = {
	getInstanceOf,
	instance: isInstanceOf,
	isInstanceOf,
	parseInstanceOf
};