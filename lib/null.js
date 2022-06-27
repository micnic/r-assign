'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
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
const invalidTransform = 'Invalid transform function provided';

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
 * @template {TransformFunction<any>} T
 * @param {T} transform
 * @returns {TransformFunction<ReturnType<T> | null>}
 */
const getNullable = (transform) => {

	// Check for provided transform function
	if (typeof transform !== 'function') {
		throw TypeError(invalidTransform);
	}

	return (value, key, source) => {

		// Check for null values to accept them
		if (value === null) {
			return value;
		}

		return transform(value, key, source);
	};
};

/**
 * Extract and validate null values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<null>}
 */
const parseNull = (value, key) => {

	// Throw for invalid type values
	if (!isNull(value)) {
		throw TypeError(invalidValue(isNull, value, key));
	}

	return value;
};

/**
 * Extract and validate nullable values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {TypeGuard} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T> | null>}
 */
const parseNullable = (type) => {

	const check = isNullable(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return value;
	};
};

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