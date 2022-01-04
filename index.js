'use strict';

const { hasOneElement } = require('r-assign/lib/internal/array-checks');
const { forIn } = require('r-assign/lib/internal/object-utils');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformSchema<T>} TransformSchema
 */

/**
 * @template {TransformSchema} S
 * @typedef {import('r-assign').InferType<S>} InferType
 */

const { assign } = Object;

const invalidSchema = 'Invalid schema argument type, object expected';

/**
 * Extract one source object or merge an array of source objects
 * @template {Record<string, any>} T
 * @param {T[]} sources
 * @returns {T}
 */
const getSource = (sources) => {

	// Check for one source object
	if (hasOneElement(sources) && typeof sources[0] === 'object') {
		return sources[0];
	}

	return assign({}, ...sources);
};

/**
 * Returns message for invalid schema property error
 * @param {string} key
 * @returns {string}
 */
const invalidSchemaProperty = (key) => {
	return `Invalid property type, "${key}" property expected to be a function`;
};

/**
 * Assign object properties and transform result based on the provided schema
 * @template {TransformSchema<any>} S
 * @template {Record<string, any>} T
 * @param {S} schema
 * @param {T[]} sources
 * @returns {InferType<S>}
 */
const rAssign = (schema, ...sources) => {

	// Check for valid schema provided
	if (typeof schema !== 'object' || schema === null) {
		throw TypeError(invalidSchema);
	}

	/** @type {any} */ // TODO: find a way to replace with a specific type
	const result = {};
	const source = getSource(sources);

	// Loop through schema properties to select them
	forIn(schema, (transform, key) => {

		// Check for valid schema properties
		if (typeof transform !== 'function') {
			throw TypeError(invalidSchemaProperty(key));
		}

		const value = transform(source[key], key, source);

		// Skip values that are undefined
		if (value !== undefined) {
			result[key] = value;
		}
	});

	return result;
};

module.exports = rAssign;