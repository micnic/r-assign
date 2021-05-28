'use strict';

const {
	getTypeGuardMeta,
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template S
 * @typedef {import('r-assign/lib').InferShape<S>} InferShape
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { keys } = Object;
const { hasOwnProperty } = Object.prototype;

const invalidShape = 'Shape is not an object';

/**
 * Get object annotation from the provided shape
 * @template {Shape} S
 * @param {S} shape
 * @returns {string}
 */
const getObjectAnnotation = (shape) => {

	return `{\n${keys(shape).map((key) => {

		const { annotation, classification } = getTypeGuardMeta(shape[key]);

		// Check for optional type guard
		if (classification === 'optional') {
			return ` "${key}"?: ${annotation};\n`;
		}

		return ` "${key}": ${annotation};\n`;
	})}}`;
};

/**
 * Check if object has own property with the provided key
 * @template {Record<string, any>} T
 * @param {T} object
 * @param {string} key
 * @returns {key is keyof T}
 */
const hasOwn = (object, key) => hasOwnProperty.call(object, key);

/**
 * Copy specific properties from source and return a new object
 * @template {Shape} S
 * @param {InferShape<S>} source
 * @param {S} shape
 * @returns {InferShape<S>}
 */
const pickKeys = (source, shape) => {

	/** @type {any} */ // TODO: find a way to replace with a specific type
	const result = {};

	// Loop through shape properties to select them
	for (const key in shape) {
		if (hasOwn(shape, key) && hasOwn(source, key)) {
			result[key] = source[key];
		}
	}

	return result;
};

/**
 * Check for object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<InferShape<S>> }>}
 */
const isObjectOf = (shape) => {

	// Check for non-object shapes
	if (shape === null || typeof shape !== 'object' || !keys(shape).length) {
		throw TypeError(invalidShape);
	}

	const annotation = getObjectAnnotation(shape);

	/** @type {TypeGuard<InferShape<S>>} */
	const check = (value) => {

		// Check for non-object values
		if (value === null || typeof value !== 'object') {
			return false;
		}

		// Check value with every type guard from the shape
		for (const key in shape) {
			if (hasOwn(shape, key) && !shape[key](value[key])) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'object',
		description: `an object of shape ${annotation}`
	});

	return check;
};

/**
 * Check for strict object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<InferShape<S>>}
 */
const isStrictObjectOf = (shape) => {

	const check = isObjectOf(shape);

	/** @type {TypeGuard<InferShape<S>>} */
	const result = (value) => {

		// Check for objects of shape
		if (check(value)) {

			// Check for keys that are in value but not in shape
			for (const key in value) {
				if (hasOwn(value, key) && !hasOwn(shape, key)) {
					return false;
				}
			}

			return true;
		}

		return false;
	};

	// Save type guard meta
	setTypeGuardMeta(result, getTypeGuardMeta(check));

	return result;
};

/**
 * Extract object values
 * @template {Shape} S
 * @param {S} shape
 * @param {InferShape<S>} initial
 * @returns {TransformFunction<InferShape<S>>}
 */
const getObjectOf = (shape, initial) => {

	const check = isObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidPropertyType(check, true, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickKeys(value, shape);
		}

		return pickKeys(initial, shape);
	};
};

/**
 * Extract strict object values
 * @template {Shape} S
 * @param {S} shape
 * @param {InferShape<S>} initial
 * @returns {TransformFunction<InferShape<S>>}
 */
const getStrictObjectOf = (shape, initial) => {

	const check = isStrictObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidPropertyType(check, true, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return { ...value };
		}

		return { ...initial };
	};
};

/**
 * Extract and validate object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseObjectOf = (shape) => {

	const check = isObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return pickKeys(value, shape);
	};
};

/**
 * Extract and validate strict object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseStrictObjectOf = (shape) => {

	const check = isStrictObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return { ...value };
	};
};

module.exports = {
	getObjectOf,
	getStrictObjectOf,
	isObjectOf,
	isStrictObjectOf,
	parseObjectOf,
	parseStrictObjectOf
};