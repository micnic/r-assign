'use strict';

const { getType } = require('r-assign/lib/get-type');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');
const { isUndefined } = require('r-assign/lib/undefined');

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

const invalidOptionalNullable = 'Optional type cannot be nullable';
const invalidOptionalNullish = 'Optional type cannot be nullish';

/**
 * Get nullable/nullish annotation
 * @param {TypeGuard} type
 * @param {boolean} nullish
 * @returns {string}
 */
const getAnnotation = (type, nullish) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	// Check for optional type
	if (classification === 'optional') {

		// Check for nullish type
		if (nullish) {
			throw TypeError(invalidOptionalNullish);
		}

		throw TypeError(invalidOptionalNullable);
	}

	// Check for nullish type
	if (nullish) {
		return `(${annotation} | null | undefined)`;
	}

	return `(${annotation} | null)`;
};

/**
 * Check for null values
 * @type {TypeGuard<null>}
 */
const isNull = (value) => (value === null);

// Save type guard meta
setTypeGuardMeta(isNull, {
	annotation: 'null',
	classification: 'literal',
	description: 'a null value',
	literal: null
});

/**
 * Check for nullable values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T> | null>}
 */
const isNullable = (type) => {

	const annotation = getAnnotation(type, false);

	/** @type {TypeGuard<InferTypeGuard<T> | null>} */
	const check = (value) => (isNull(value) || type(value));

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'union',
		description: `an union of ${annotation}`,
		union: [type, isNull]
	});

	return check;
};

/**
 * Check for nullish values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T> | null | undefined>}
 */
const isNullish = (type) => {

	const annotation = getAnnotation(type, true);

	/** @type {TypeGuard<InferTypeGuard<T> | null | undefined>} */
	const check = (value) => (
		isNull(value) || isUndefined(value) || type(value)
	);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'union',
		description: `an union of ${annotation}`,
		union: [type, isNull, isUndefined]
	});

	return check;
};

/**
 * Extract null values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @type {TransformFunction<null>}
 */
const getNull = () => null;

/**
 * Extract nullable values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {TypeGuard} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T> | null>}
 */
const getNullable = (type) => getType(isNullable(type), null);

/**
 * Extract and validate null values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<null>}
 */
const parseNull = parseType(isNull);

/**
 * Extract and validate nullable values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {TypeGuard} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T> | null>}
 */
const parseNullable = (type) => parseType(isNullable(type));

module.exports = {
	getNull,
	getNullable,
	isNull,
	isNullable,
	isNullish,
	nullable: isNullable,
	nulled: isNull,
	nullish: isNullish,
	parseNull,
	parseNullable
};