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
 * @typedef {import('r-assign/lib').TypeClassification} TypeClassification
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { isArray } = Array;

/**
 * Get array description based on the provided annotation and classification
 * @param {string} annotation
 * @param {TypeClassification} classification
 * @returns {string}
 */
const getArrayDescription = (annotation, classification) => {

	const description = `an array of ${annotation}`;

	// Add plural for primitive annotation
	if (classification === 'primitive') {
		return `${description}s`;
	}

	return description;
};

/**
 * Check for array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T>[]>}
 */
const isArrayOf = (type) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	/** @type {TypeGuard<InferTypeGuard<T>[]>} */
	const check = (value) => {

		// Check for non-array values
		if (!isArray(value)) {
			return false;
		}

		// Loop array elements to check them
		for (const element of value) {
			if (!type(element)) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation: `${annotation}[]`,
		classification: 'array',
		description: getArrayDescription(annotation, classification)
	});

	return check;
};

/**
 * Extract array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @param {InferTypeGuard<T>[]} [initial]
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const getArrayOf = (type, initial = []) => {

	const check = isArrayOf(type);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidPropertyType(check, true, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return [ ...value ];
		}

		return [ ...initial ];
	};
};

/**
 * Extract and validate array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const parseArrayOf = (type) => {

	const check = isArrayOf(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return [ ...value ];
	};
};

module.exports = {
	getArrayOf,
	isArrayOf,
	parseArrayOf
};