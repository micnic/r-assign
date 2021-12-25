'use strict';

const {
	checkInvalidOptional
} = require('r-assign/lib/internal/check-invalid-optional');
const {
	invalidInitialValue,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { hasOwn } = require('r-assign/lib/internal/has-own');
const { pickObject } = require('r-assign/lib/internal/pick-value');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template {Shape} S
 * @typedef {import('r-assign/lib').InferShape<S>} InferShape
 */

const { entries, keys } = Object;

const invalidShape = 'Shape is not an object';

/**
 * Get object annotation from the provided shape
 * @template {Shape} S
 * @param {S} shape
 * @returns {string}
 */
const getObjectAnnotation = (shape) => {

	// Check for empty shape
	if (keys(shape).length === 0) {
		return '{}';
	}

	return `{\n${entries(shape).map(([key, type]) => {

		const { annotation, classification } = getTypeGuardMeta(type);

		// Check for optional type guard
		if (classification === 'optional') {
			return ` "${key}"?: ${annotation};\n`;
		}

		return ` "${key}": ${annotation};\n`;
	}).join('')}}`;
};

/**
 * Check for object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<InferShape<S>> }>}
 */
const isObjectOf = (shape) => {

	// Check for non-object shapes
	if (shape === null || typeof shape !== 'object') {
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
		for (const [key, type] of entries(shape)) {

			const property = value[key];

			// Check property type
			if (
				(hasOwn(value, key) && checkInvalidOptional(type, property)) ||
				!type(property)
			) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'object',
		description: `an object of shape ${annotation}`,
		shape
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
 * @deprecated will be removed in version 2.0, use getType instead
 * @template {Shape} S
 * @param {S} shape
 * @param {InferShape<S>} initial
 * @returns {TransformFunction<InferShape<S>>}
 */
const getObjectOf = (shape, initial) => {

	const check = isObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickObject(value, shape);
		}

		return pickObject(initial, shape);
	};
};

/**
 * Extract strict object values
 * @deprecated will be removed in version 2.0, use getType instead
 * @template {Shape} S
 * @param {S} shape
 * @param {InferShape<S>} initial
 * @returns {TransformFunction<InferShape<S>>}
 */
const getStrictObjectOf = (shape, initial) => {

	const check = isStrictObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
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
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseObjectOf = (shape) => {

	const check = isObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return pickObject(value, shape);
	};
};

/**
 * Extract and validate strict object values
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseStrictObjectOf = (shape) => {

	const check = isStrictObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
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