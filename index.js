'use strict';

/**
 * @template S
 * @typedef {import('r-assign').InferType<S>} InferType
 */

/**
 * @template T
 * @typedef {import('r-assign').TransformSchema<T>} TransformSchema
 */

const { assign, prototype } = Object;
const { hasOwnProperty } = prototype;

const invalidSchema = 'Invalid schema argument type, object expected';

/**
 * Extract one source object or merge an array of source objects
 * @template {Record<string, any>} T
 * @param {T[]} sources
 * @returns {T}
 */
const getSource = (sources) => {

	// Check for one source object
	if (sources.length === 1 && typeof sources[0] === 'object') {
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
	for (const key in schema) {
		if (hasOwnProperty.call(schema, key)) {

			const transform = schema[key];

			// Check for valid schema properties
			if (typeof transform !== 'function') {
				throw TypeError(invalidSchemaProperty(key));
			}

			const value = transform(source[key], key, source);

			// Skip values that are undefined
			if (typeof value !== 'undefined') {
				result[key] = value;
			}
		}
	}

	return result;
};

module.exports = rAssign;