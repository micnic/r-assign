import {
	hasAtLeastOneElement,
	hasOneElement
} from './lib/internal/array-checks.js';
import { parseType } from 'r-assign/parse-type';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformSchema<T>} TransformSchema
 */

/**
 * @template {TransformSchema} S
 * @typedef {import('r-assign').InferType<S>} InferType
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferTG<T>} InferTypeGuard
 */

const { assign, entries } = Object;

const invalidSchema = 'Invalid schema argument type, object expected';

/**
 * Extract one source object or merge an array of source objects
 * @param {unknown[]} sources
 * @returns {Record<string, any>}
 */
const getSource = (sources) => {

	// Check for multiple source objects
	if (
		!hasAtLeastOneElement(sources) ||
		typeof sources[0] !== 'object' ||
		sources[0] === null
	) {
		return {};
	}

	// Check for one source object
	if (
		hasOneElement(sources) &&
		typeof sources[0] === 'object' &&
		sources[0] !== null
	) {
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
 * @template {TypeGuard | TransformSchema} S
 * @param {S extends TypeGuard ? BaseTypeGuard<S> : S} schema
 * @param {S extends TypeGuard ? [unknown] : unknown[]} sources
 * @returns {S extends TypeGuard ? InferTypeGuard<S> : InferType<S>}
 */
const rAssign = (schema, ...sources) => {

	// Parse source based on the provided type guard schema
	if (typeof schema === 'function') {
		return parseType(schema)(sources[0]);
	}

	// Check for valid schema provided
	if (typeof schema !== 'object' || schema === null) {
		throw TypeError(invalidSchema);
	}

	/** @type {any} */
	const result = {};

	const source = getSource(sources);

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

export default rAssign;

export * from 'r-assign/any';
export * from 'r-assign/array';
export * from 'r-assign/assert-type';
export * from 'r-assign/bigint';
export * from 'r-assign/boolean';
export * from 'r-assign/date';
export * from 'r-assign/function';
export * from 'r-assign/get-type';
export * from 'r-assign/instance';
export * from 'r-assign/intersection';
export * from 'r-assign/literal';
export * from 'r-assign/never';
export * from 'r-assign/null';
export * from 'r-assign/number';
export * from 'r-assign/object';
export * from 'r-assign/optional';
export * from 'r-assign/parse-type';
export * from 'r-assign/partial';
export * from 'r-assign/promise';
export * from 'r-assign/record';
export * from 'r-assign/required';
export * from 'r-assign/same';
export * from 'r-assign/string';
export * from 'r-assign/symbol';
export * from 'r-assign/template-literal';
export * from 'r-assign/tuple';
export * from 'r-assign/undefined';
export * from 'r-assign/union';