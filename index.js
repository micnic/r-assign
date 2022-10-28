'use strict';

const { hasOneElement } = require('r-assign/lib/internal/array-checks');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformSchema<T>} TransformSchema
 */

/**
 * @template {TransformSchema} S
 * @typedef {import('r-assign').InferType<S>} InferType
 */

const { assign, entries } = Object;

const invalidSchema = 'Invalid schema argument type, object expected';

/**
 * Extract one source object or merge an array of source objects
 * @template {Record<string, any>} S
 * @param {S[]} sources
 * @returns {S}
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
 * @param {S} schema
 * @param {Record<string, any>[]} sources
 * @returns {InferType<S>}
 */
const rAssign = (schema, ...sources) => {

	// Check for valid schema provided
	if (typeof schema !== 'object' || schema === null) {
		throw TypeError(invalidSchema);
	}

	const source = getSource(sources);

	/** @type {any} */
	const result = {};

	// Populate result properties
	entries(schema).forEach(([key, transform]) => {

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