'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isUnionOf } = require('r-assign/lib/union');
const { isUndefined } = require('r-assign/lib/undefined');

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
 * @typedef {import('r-assign/lib').NOTG<T>} NotOptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').OTG<T>} OptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef OptionalTag
 * @property {true} optional
 */

const { assign } = Object;

/** @type {OptionalTag} */
const optionalTag = { optional: true };

const invalidOptionalType = 'Optional type cannot be wrapped in optional type';
const invalidTransform = 'Invalid transform function provided';

/**
 * Get optional annotation
 * @param {TypeGuard<any>} type
 * @returns {string}
 */
const getOptionalAnnotation = (type) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	// Check for optional type
	if (classification === 'optional') {
		throw TypeError(invalidOptionalType);
	}

	return annotation;
};

/**
 * Check for strict optional values
 * @template {TypeGuard<any>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T>>}
 */
const isOptional = (type) => {

	const annotation = getOptionalAnnotation(type);

	/** @type {TypeGuard<InferTypeGuard<T>>} */
	const guard = (value) => {

		// Check for non-array values
		if (typeof value === 'undefined') {
			return true;
		}

		return type(value);
	};

	/** @type {OptionalTypeGuard<InferTypeGuard<T>>} */
	const check = assign(guard, optionalTag);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'optional',
		description: `an optional value of ${annotation}`,
		type
	});

	return check;
};

/**
 * Check for optional or undefined values
 * @template {TypeGuard<any>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T> | undefined>}
 */
const isOptionalUndefined = (type) => {

	const annotation = getOptionalAnnotation(type);
	const inner = isUnionOf([type, isUndefined]);

	/** @type {TypeGuard<InferTypeGuard<T>>} */
	const guard = (value) => inner(value);

	/** @type {OptionalTypeGuard<InferTypeGuard<T>>} */
	const check = assign(guard, optionalTag);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'optional',
		description: `an optional value of ${annotation}`,
		type: inner
	});

	return check;
};

/**
 * Extract optional values
 * @deprecated will be removed in version 2.0, use getType instead
 * @template {TransformFunction<any>} T
 * @param {T} transform
 * @returns {TransformFunction<ReturnType<T> | undefined>}
 */
const getOptional = (transform) => {

	// Check for provided transform function
	if (typeof transform !== 'function') {
		throw TypeError(invalidTransform);
	}

	return (value, key, source) => {

		// Check for undefined values to accept them
		if (typeof value === 'undefined') {
			return value;
		}

		return transform(value, key, source);
	};
};

/**
 * Extract and validate optional values
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {TypeGuard<any>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {TransformFunction<InferTypeGuard<T> | undefined>}
 */
const parseOptional = (type) => {

	const check = isOptional(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return value;
	};
};

module.exports = {
	getOptional,
	isOptional,
	isOptionalUndefined,
	parseOptional
};