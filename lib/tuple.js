'use strict';

const { getType } = require('r-assign/lib/get-type');
const {
	checkInvalidOptional
} = require('r-assign/lib/internal/check-invalid-optional');
const {
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
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @template {Tuple} T
 * @typedef {import('r-assign/lib').InferT<T>} InferTuple
 */

const { isArray } = Array;
const { values } = Object;

const invalidOptionalIndex = 'Optional element on invalid index';
const invalidTypeGuards = 'Invalid type guards provided';

/**
 * Find first optional type
 * @param {TypeGuard} type
 * @returns {boolean}
 */
const findOptional = (type) => {
	return getTypeGuardMeta(type).classification === 'optional';
};

/**
 * Find first required type
 * @param {TypeGuard} type
 * @returns {boolean}
 */
const findRequired = (type) => {
	return getTypeGuardMeta(type).classification !== 'optional';
};

/**
 * Get the minimum length of the provided tuple
 * @template {Tuple} T
 * @param {T} tuple
 * @returns {number}
 */
const getMinTupleLength = (tuple) => {

	const optional = tuple.findIndex(findOptional);

	// When no optional type is found, return the length of the tuple
	if (optional < 0) {
		return tuple.length;
	}

	// When required type is found after optional, throw error
	if (tuple.slice(optional).findIndex(findRequired) >= 0) {
		throw TypeError(invalidOptionalIndex);
	}

	return optional;
};

/**
 * Get tuple annotation
 * @param {Tuple} tuple
 * @returns {string}
 */
const getTupleAnnotation = (tuple) => `[ ${tuple.map((type) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	// Check for tail optional type guards
	if (classification === 'optional') {
		return `${annotation}?`;
	}

	return annotation;
}).join(', ')} ]`;

/**
 * Check for tuple values
 * @template {Tuple} T
 * @param {T} types
 * @returns {TypeGuard<InferTuple<T>>}
 */
const isTupleOf = (types) => {

	// Check for valid type guards provided
	if (!isArray(types)) {
		throw TypeError(invalidTypeGuards);
	}

	/** @type {Tuple} */
	const tuple = values(types);
	const max = tuple.length;
	const min = getMinTupleLength(tuple);
	const annotation = getTupleAnnotation(tuple);

	/** @type {TypeGuard<InferTuple<T>>} */
	const check = (value) => {

		// Check for non-array values or invalid array length
		if (!isArray(value)) {
			return false;
		}

		const { length } = value;

		// Check for valid value length
		if (length < min || length > max) {
			return false;
		}

		return value.every((element, index) => {

			const type = tuple[index];

			return (
				type && type(element) && !checkInvalidOptional(type, element)
			);
		});
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'tuple',
		description: `a tuple of ${annotation}`,
		tuple
	});

	return check;
};

/**
 * Extract tuple values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Tuple} T
 * @param {T} tuple
 * @param {InferTuple<T>} initial
 * @returns {TransformFunction<InferTuple<T>>}
 */
const getTupleOf = (tuple, initial) => getType(isTupleOf(tuple), initial);

/**
 * Extract and validate tuple values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Tuple} T
 * @param {T} tuple
 * @returns {TransformFunction<InferTuple<T>>}
 */
const parseTupleOf = (tuple) => parseType(isTupleOf(tuple));

module.exports = {
	getTupleOf,
	isTupleOf,
	parseTupleOf,
	tuple: isTupleOf
};