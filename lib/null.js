'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const invalidOptionalType = 'Optional type cannot be nullable';
const invalidTransform = 'Invalid transform function provided';

/**
 * Get nullable annotation
 * @param {TypeGuard<any>} type
 * @returns {string}
 */
const getNullableAnnotation = (type) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	// Check for optional type
	if (classification === 'optional') {
		throw TypeError(invalidOptionalType);
	}

	return `(${annotation} | null)`;
};

/**
 * Check for null values
 * @type {TypeGuard<null>}
 */
const isNull = (value) => {

	return (value === null);
};

// Save type guard meta
setTypeGuardMeta(isNull, {
	annotation: 'null',
	classification: 'literal',
	description: 'a null value'
});

/**
 * Check for nullable values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T> | null>}
 */
const isNullable = (type) => {

	const annotation = getNullableAnnotation(type);

	/** @type {TypeGuard<InferTypeGuard<T> | null>} */
	const check = (value) => {

		// Check for non-array values
		if (value === null) {
			return true;
		}

		return type(value);
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'nullable',
		description: `an union of ${annotation}`,
		type
	});

	return check;
};

/**
 * Extract null values
 * @deprecated will be removed in version 2.0, use getType instead
 * @returns {TransformFunction<null>}
 */
const getNull = () => {

	return () => null;
};

/**
 * Extract nullable values
 * @deprecated will be removed in version 2.0, use getType instead
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
 * @deprecated will be removed in version 2.0, use parseType instead
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
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {TypeGuard<any>} T
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
	parseNull,
	parseNullable
};