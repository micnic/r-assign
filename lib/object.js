'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib/object').Shape} Shape
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/type').ExtractTypeGuard<T>} ExtractTypeGuard
 */

const { keys } = Object;

/**
 * Check for object values
 * @template {Shape} S
 * @param {S} shape
 * @param {any} [value]
 * @returns {value is { [key in keyof S]: ExtractTypeGuard<S[key]> }}
 */
const isObject = (shape, value) => {

	// Check for non-object shapes
	if (!shape || typeof shape !== 'object') {
		throw new TypeError('Shape is not an object');
	}

	// Check for non-object values
	if (!value || typeof value !== 'object') {
		return false;
	}

	return keys(shape).every((key) => {

		const type = shape[key];

		// Check for valid specific type
		if (typeof type !== 'function') {
			throw new TypeError('Invalid type check provided');
		}

		const result = type(value[key]);

		// Check for valid return value of type check
		if (typeof result !== 'boolean') {
			throw new TypeError('Invalid return value of type check');
		}

		return result;
	});
};

/**
 * Creator of transform functions for object values
 * @template {Shape} S
 * @param {S} shape
 * @param {{ [key in keyof S]: ExtractTypeGuard<S[key]> }} initial
 * @returns {TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>}
 */
const useObject = (shape, initial) => {

	// Check for default value to be of a valid type
	if (!isObject(shape, initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (isObject(shape, value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Creator of transform functions for array validation
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>}
 */
const useObjectValidation = (shape) => {

	// Validate provided shape
	isObject(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!isObject(shape, value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

module.exports = {
	isObject,
	useObject,
	useObjectValidation
};