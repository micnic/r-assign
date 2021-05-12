'use strict';

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
 * @typedef {import('r-assign/lib').ResultObject<S>} ResultObject
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { hasOwnProperty } = Object.prototype;

const invalidDefaultValue = 'Invalid default value';
const invalidShape = 'Shape is not an object';
const invalidTypeGuard = 'Invalid type guard provided';
const invalidTypeGuardReturn = 'Invalid return value of type guard';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property "${key}" has invalid type`;
};

/**
 * Check if object has own property with the provided key
 * @param {any} object
 * @param {string} key
 * @returns {boolean}
 */
const hasOwn = (object, key) => hasOwnProperty.call(object, key);

/**
 * Copy specific properties from source and return a new object
 * @template {Shape} S
 * @param {ResultObject<S>} source
 * @param {S} shape
 * @returns {ResultObject<S>}
 */
const pickKeys = (source, shape) => {

	/** @type {any} */ // TODO: find a way to replace with a specific type
	const result = {};

	// Loop through shape properties to select them
	for (const key in shape) {
		if (hasOwn(shape, key) && hasOwn(source, key)) {
			// @ts-ignore TODO: find a way to not ignore this error
			result[key] = source[key];
		}
	}

	return result;
};

/**
 * Check for object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<ResultObject<S>> }>}
 */
const isObjectOf = (shape) => {

	// Check for non-object shapes
	if (shape === null || typeof shape !== 'object') {
		throw new TypeError(invalidShape);
	}

	// Validate each shape type guard
	for (const key in shape) {
		if (hasOwn(shape, key)) {

			const type = shape[key];

			// Check for valid type guard
			if (typeof type !== 'function') {
				throw new TypeError(invalidTypeGuard);
			}

			// Check for valid return value of type guard
			if (typeof type() !== 'boolean') {
				throw new TypeError(invalidTypeGuardReturn);
			}
		}
	}

	/** @type {TypeGuard<ResultObject<S>>} */
	const result = (value) => {

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

	return result;
};

/**
 * Check for strict object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<ResultObject<S>>}
 */
const isStrictObjectOf = (shape) => {

	const check = isObjectOf(shape);

	/** @type {TypeGuard<ResultObject<S>>} */
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

	return result;
};

/**
 * Extract object values
 * @template {Shape} S
 * @param {S} shape
 * @param {ResultObject<S>} initial
 * @returns {TransformFunction<ResultObject<S>>}
 */
const getObjectOf = (shape, initial) => {

	const check = isObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickKeys(value, shape);
		}

		return { ...initial };
	};
};

/**
 * Extract strict object values
 * @template {Shape} S
 * @param {S} shape
 * @param {ResultObject<S>} initial
 * @returns {TransformFunction<ResultObject<S>>}
 */
const getStrictObjectOf = (shape, initial) => {

	const check = isStrictObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
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
 * @returns {TransformFunction<ResultObject<S>>}
 */
const parseObjectOf = (shape) => {

	const check = isObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return pickKeys(value, shape);
	};
};

/**
 * Extract and validate strict object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<ResultObject<S>>}
 */
const parseStrictObjectOf = (shape) => {

	const check = isStrictObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
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