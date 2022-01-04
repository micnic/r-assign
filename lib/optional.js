'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
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
 * @template [T = any]
 * @typedef {import('r-assign/lib').OTG<T>} OptionalTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').NOTG<T>} NotOptionalTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
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
 * @param {TypeGuard} type
 * @param {boolean} undef
 * @returns {string}
 */
const getOptionalAnnotation = (type, undef) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	// Check for optional type
	if (classification === 'optional') {
		throw TypeError(invalidOptionalType);
	}

	// Check for undefined optional
	if (undef) {
		return `(${annotation} | undefined)`;
	}

	return annotation;
};

/**
 * Wrapper for optional type guards
 * @template {TypeGuard} T
 * @param {NotOptionalTypeGuard<T>} type
 * @param {boolean} undef
 * @returns {OptionalTypeGuard<InferTypeGuard<T>>}
 */
const wrapOptional = (type, undef) => {

	const annotation = getOptionalAnnotation(type, undef);

	/** @type {TypeGuard<InferTypeGuard<T>>} */
	const guard = (value) => (value === undefined || type(value));

	/** @type {OptionalTypeGuard<InferTypeGuard<T>>} */
	const check = assign(guard, optionalTag);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'optional',
		description: `an optional value of ${annotation}`,
		main: check,
		type,
		undef
	});

	return check;
};

/**
 * Check for strict optional values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T>>}
 */
const isOptional = (type) => wrapOptional(type, false);

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T> | undefined>}
 */
const isOptionalUndefined = (type) => wrapOptional(type, true);

/**
 * Extract optional values
 * @deprecated will be removed in version 2.0, use `getType()` instead
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
		if (value === undefined) {
			return value;
		}

		return transform(value, key, source);
	};
};

/**
 * Extract and validate optional values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {TypeGuard} T
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
	optional: isOptional,
	optionalUndef: isOptionalUndefined,
	parseOptional
};