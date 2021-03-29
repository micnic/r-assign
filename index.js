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
 * @param {any[]} sources
 * @returns {InferType<S>}
 */
const rAssign = (schema, ...sources) => {

	// Check for valid schema provided
	if (!schema || typeof schema !== 'object') {
		throw TypeError(invalidSchema);
	}

	/** @type {any} */
	const result = {};
	const source = assign({}, ...sources);

	// Loop through schema properties to select them
	for (const key in schema) {
		if (hasOwnProperty.call(schema, key)) {

			// Check for valid schema properties
			if (typeof schema[key] !== 'function') {
				throw TypeError(invalidSchemaProperty(key));
			}

			const value = schema[key](source[key], key, source);

			// Skip values that are undefined
			if (typeof value !== 'undefined') {
				result[key] = value;
			}
		}
	}

	return result;
};

module.exports = rAssign;