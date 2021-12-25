'use strict';

const {
	invalidInitialValue,
	invalidOptionalType,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { pickUnion } = require('r-assign/lib/internal/pick-value');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = unknown]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Union} Union
 */

/**
 * @template {Union} U
 * @typedef {import('r-assign/lib').InferUnion<U>} InferUnion
 */

const { isArray } = Array;

const anyUnion = 'Provided union of any';
const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

/**
 * Get union annotation
 * @template {Union} U
 * @param {U} union
 * @returns {string}
 */
const getUnionAnnotation = (union) => {

	/** @type {string[]} */
	const annotations = [];

	// Loop over all type guards
	for (const type of union) {

		const { annotation, classification } = getTypeGuardMeta(type);

		// Check for any type
		if (classification === 'any') {
			throw TypeError(anyUnion);
		}

		// Check for optional type
		if (classification === 'optional') {
			throw TypeError(invalidOptionalType('union'));
		}

		// Add annotation to the list if it is not already in the list
		if (!annotations.includes(annotation)) {
			annotations.push(annotation);
		}
	}

	// Return the annotation for just one type
	if (annotations.length === 1) {
		return String(annotations);
	}

	return `(${annotations.join(' | ')})`;
};

/**
 * Check for union type values
 * @note Does not accept `isAny` type guard as it is redundant
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {Union} U
 * @param {U} union
 * @returns {TypeGuard<InferUnion<U>>}
 */
const isUnionOf = (union) => {

	// Check for valid type guards provided
	if (!isArray(union)) {
		throw TypeError(invalidTypeGuards);
	}

	// Check for less than two type guards
	if (union.length <= 1) {
		throw TypeError(notEnoughTypeGuards);
	}

	const annotation = getUnionAnnotation(union);

	/** @type {TypeGuard<InferUnion<U>>} */
	const check = (value) => {

		// Check for at least one type guard in union
		for (const type of union) {
			if (type(value)) {
				return true;
			}
		}

		return false;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'union',
		description: `an union of ${annotation}`,
		types: union
	});

	return check;
};

/**
 * Extract union type values
 * @deprecated will be removed in version 2.0, use getType instead
 * @template {Union} U
 * @param {U} union
 * @param {InferUnion<U>} initial
 * @returns {TransformFunction<InferUnion<U>>}
 */
const getUnionOf = (union, initial) => {

	const check = isUnionOf(union);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickUnion(value, union);
		}

		return pickUnion(initial, union);
	};
};

/**
 * Extract and validate union type values
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {Union} U
 * @param {U} union
 * @returns {TransformFunction<InferUnion<U>>}
 */
const parseUnionOf = (union) => {

	const check = isUnionOf(union);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return pickUnion(value, union);
	};
};

module.exports = {
	getUnionOf,
	isUnionOf,
	parseUnionOf
};