'use strict';

const { getType } = require('r-assign/lib/get-type');
const {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').BTG<T>} BaseTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib/internal').TC} TypeClassification
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
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<InferTypeGuard<T>[]>}
 */
const isArrayOf = (type) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(classification);

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
		description: getArrayDescription(annotation, classification),
		same: false,
		type
	});

	return check;
};

/**
 * Extract array values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {InferTypeGuard<T>[]} [initial]
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const getArrayOf = (type, initial = []) => getType(isArrayOf(type), initial);

/**
 * Extract and validate array values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const parseArrayOf = (type) => parseType(isArrayOf(type));

module.exports = {
	array: isArrayOf,
	getArrayOf,
	isArrayOf,
	parseArrayOf
};