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

/**
 * @template T
 * @typedef {import('r-assign/lib/union').TypeGuard<T>} TypeGuard
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
 * @returns {TypeGuard<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>}
 */
const isObjectOf = (shape) => {

	// Validate shape before checking the value
	validateShape(shape);

	/** @type {TypeGuard<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>} */
	const result = (value) => {

		// Check for non-object values
		if (!value || typeof value !== 'object') {
			return false;
		}

		return keys(shape).every((key) => shape[key](value[key]));
	};

	return result;
};

/**
 * Creator of transform functions for object values
 * @template {Shape} S
 * @param {S} shape
 * @param {{ [key in keyof S]: ExtractTypeGuard<S[key]> }} initial
 * @returns {TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>}
 */
const getObjectOf = (shape, initial) => {

	const check = isObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
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
const parseObjectOf = (shape) => {

	const check = isObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

module.exports = {
	getObjectOf,
	isObjectOf,
	parseObjectOf
};