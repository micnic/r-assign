'use strict';

const { invalidOptional } = require('r-assign/lib/internal/errors');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isUndefined } = require('r-assign/lib/undefined');
const { isUnionOf } = require('r-assign/lib/union');

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
 * @typedef {import('r-assign/lib').BTG<T>} BaseTypeGuard
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
		throw TypeError(invalidOptional);
	}

	// Check for undefined optional
	if (undef) {
		return `${annotation} | undefined`;
	}

	return annotation;
};

/**
 * Get optional type guard
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {boolean} undef
 * @returns {TypeGuard<InferTypeGuard<T>>}
 */
const getOptionalTypeGuard = (type, undef) => {

	// Check for undefined optional
	if (undef) {

		const check = isUnionOf([type, isUndefined]);

		/** @type {TypeGuard<InferTypeGuard<T>>} */
		const guard = (value) => check(value);

		return guard;
	}

	/** @type {TypeGuard<InferTypeGuard<T>>} */
	const guard = (value) => type(value);

	return guard;
};

/**
 * Wrapper for optional type guards
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {boolean} undef
 * @returns {OptionalTypeGuard<InferTypeGuard<T>>}
 */
const wrapOptional = (type, undef) => {

	const annotation = getOptionalAnnotation(type, undef);
	const check = assign(getOptionalTypeGuard(type, undef), optionalTag);

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
 * @param {BaseTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T>>}
 */
const isOptional = (type) => wrapOptional(type, false);

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T> | undefined>}
 */
const isOptionalUndefined = (type) => wrapOptional(type, true);

module.exports = {
	isOptional,
	isOptionalUndefined,
	optional: isOptional,
	optionalUndef: isOptionalUndefined
};