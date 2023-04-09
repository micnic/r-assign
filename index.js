import {
	assertBaseClassification,
	getTypeGuardMeta
} from './lib/internal/type-guard-meta.js';
import { pickValue } from './lib/internal/pick-value.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformSchema<T>} TransformSchema
 */

/**
 * @template {TransformSchema} S
 * @typedef {import('r-assign').InferTransform<S>} InferTransform
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
 * @typedef {import('r-assign').InferT<T>} InferType
 */

const { assign, entries } = Object;

const invalidSchema = 'Invalid schema argument type, object expected';
const invalidObjectSource = 'Invalid source argument type, object expected';

/**
 * Extract one source object or merge an array of source objects
 * @param {unknown[]} sources
 * @returns {unknown}
 */
const getSource = (sources) => {

	// Select first source for less than two sources or non-object source
	if (sources.length < 2 || typeof sources[0] !== 'object') {
		return sources[0];
	}

	return assign({}, ...sources);
};

/**
 * Check for non-null object
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
const isObject = (value) => (typeof value === 'object' && value !== null);

/**
 * Returns message for invalid schema property error
 * @param {string} key
 * @returns {string}
 */
const invalidSchemaProperty = (key) =>
	`Invalid property type, "${key}" property expected to be a function`;

/**
 * Assign object properties and transform result based on the provided schema
 * @template {TypeGuard | TransformSchema} S
 * @param {S extends TypeGuard ? BaseTypeGuard<S> : S} schema
 * @param {S extends TypeGuard ? [unknown] : unknown[]} sources
 * @returns {S extends TypeGuard ? InferType<S> : InferTransform<S>}
 */
const rAssign = (schema, ...sources) => {

	const source = getSource(sources);

	// Parse source based on the provided type guard schema
	if (typeof schema === 'function') {

		const meta = getTypeGuardMeta(schema);

		// Assert for base type guard
		assertBaseClassification(meta.classification);

		return pickValue(source, meta);
	}

	// Check for valid schema provided
	if (!isObject(schema)) {
		throw TypeError(invalidSchema);
	}

	// Check for valid source provided
	if (!isObject(source)) {
		throw TypeError(invalidObjectSource);
	}

	/** @type {any} */
	const result = {};

	// Populate result properties
	entries(schema).forEach(([ key, transform ]) => {

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
export * from 'r-assign/string';
export * from 'r-assign/symbol';
export * from 'r-assign/template-literal';
export * from 'r-assign/tuple';
export * from 'r-assign/undefined';
export * from 'r-assign/union';