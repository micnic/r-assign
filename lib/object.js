'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { keys, prototype } = Object;
const { hasOwnProperty } = prototype;

const invalidDefaultValue = 'Invalid default value';
const invalidShape = 'Shape is not an object';
const invalidTypeCheck = 'Invalid type check provided';
const invalidTypeCheckReturn = 'Invalid return value of type check';

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
 * @param {{ [key in keyof S]: InferTypeGuard<S[key]> }} source
 * @param {S} shape
 * @returns {any}
 */
const pickKeys = (source, shape) => {

	/** @type {any} */
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
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property ${key} has invalid type`;
};

/**
 * Check for object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<{ [key in keyof S]: InferTypeGuard<S[key]> }>}
 */
const isObjectOf = (shape) => {

	// Check for non-object shapes
	if (!shape || typeof shape !== 'object') {
		throw new TypeError(invalidShape);
	}

	const shapeKeys = keys(shape);

	// Validate each shape type checker
	shapeKeys.forEach((key) => {

		const type = shape[key];

		// Check for valid type check
		if (typeof type !== 'function') {
			throw new TypeError(invalidTypeCheck);
		}

		// Check for valid return value of type check
		if (typeof type() !== 'boolean') {
			throw new TypeError(invalidTypeCheckReturn);
		}
	});

	/** @type {TypeGuard<{ [key in keyof S]: InferTypeGuard<S[key]> }>} */
	const result = (value) => {

		// Check for non-object values
		if (!value || typeof value !== 'object') {
			return false;
		}

		return shapeKeys.every((key) => shape[key](value[key]));
	};

	return result;
};

/**
 * Check for strict object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<{ [key in keyof S]: InferTypeGuard<S[key]> }>}
 */
const isStrictObjectOf = (shape) => {

	const check = isObjectOf(shape);

	/** @type {TypeGuard<{ [key in keyof S]: InferTypeGuard<S[key]> }>} */
	const result = (value) => {

		// Check for objects of shape
		if (check(value)) {

			return keys(value).every((key) => hasOwn(shape, key));
		}

		return false;
	};

	return result;
};

/**
 * Creator of transform functions for object values
 * @template {Shape} S
 * @param {S} shape
 * @param {{ [key in keyof S]: InferTypeGuard<S[key]> }} initial
 * @returns {TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>}
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
 * Creator of transform functions for strict object values
 * @template {Shape} S
 * @param {S} shape
 * @param {{ [key in keyof S]: InferTypeGuard<S[key]> }} initial
 * @returns {TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>}
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
 * Creator of transform functions for object validation
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>}
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
 * Creator of transform functions for strict object validation
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>}
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