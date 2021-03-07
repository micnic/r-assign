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
 * @typedef {import('r-assign/lib/union').ExtractTypeGuard<T>} ExtractTypeGuard
 */

const { keys } = Object;

/**
 * Validate provided shape
 * @template {Shape} S
 * @param {S} shape
 */
const validateShape = (shape) => {

	// Check for non-object shapes
	if (!shape || typeof shape !== 'object') {
		throw new TypeError('Shape is not an object');
	}

	// Validate each shape type checker
	keys(shape).forEach((key) => {

		const type = shape[key];

		// Check for valid specific type
		if (typeof type !== 'function') {
			throw new TypeError('Invalid type check provided');
		}

		// Check for valid return value of type check
		if (typeof type() !== 'boolean') {
			throw new TypeError('Invalid return value of type check');
		}
	});
};

/**
 * Check for object values
 * @template {Shape} S
 * @param {S} shape
 * @param {any} value
 * @returns {value is { [key in keyof S]: ExtractTypeGuard<S[key]> }}
 */
const isObjectOf = (shape, value) => {

	// Validate shape before checking the value
	validateShape(shape);

	// Check for non-object values
	if (!value || typeof value !== 'object') {
		return false;
	}

	return keys(shape).every((key) => shape[key](value[key]));
};

/**
 * Creator of transform functions for array validation
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>}
 */
const parseObjectOf = (shape) => {

	// Validate shape before validating the value
	validateShape(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!isObjectOf(shape, value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

/**
 * Creator of transform functions for object values
 * @template {Shape} S
 * @param {S} shape
 * @param {{ [key in keyof S]: ExtractTypeGuard<S[key]> }} initial
 * @returns {TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>}
 */
const useObjectOf = (shape, initial) => {

	// Check for default value to be of a valid type
	if (!isObjectOf(shape, initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (isObjectOf(shape, value)) {
			return value;
		}

		return initial;
	};
};

module.exports = {
	isObjectOf,
	parseObjectOf,
	useObjectOf
};