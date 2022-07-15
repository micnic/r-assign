'use strict';

const { invalidPartial } = require('r-assign/lib/internal/errors');
const { forMap } = require('r-assign/lib/internal/object-utils');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { isObjectOf, isStrictObjectOf } = require('r-assign/lib/object');
const { isOptional, isOptionalUndefined } = require('r-assign/lib/optional');
const { isTupleOf } = require('r-assign/lib/tuple');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').OTG<T>} OptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').PU<T>} PartialUndefined
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
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
 *
 * @param {TypeGuard} type
 * @returns {OptionalTypeGuard}
 */
const toOptional = (type) => {

	const meta = getTypeGuardMeta(type);

	// Check for optional type guard
	if (meta.classification === 'optional') {

		// Check for optional undefined type guard
		if (meta.undef) {
			return isOptional(meta.type);
		}

		return meta.main;
	}

	return isOptional(type);
};

/**
 *
 * @param {TypeGuard} type
 * @returns {OptionalTypeGuard}
 */
const toOptionalUndefined = (type) => {

	const meta = getTypeGuardMeta(type);

	// Check for optional type guard
	if (meta.classification === 'optional') {

		// Check for optional undefined type guard
		if (meta.undef) {
			return meta.main;
		}

		return isOptionalUndefined(meta.type);
	}

	return isOptionalUndefined(type);
};

/**
 *
 * @param {boolean} undef
 * @returns {(type: TypeGuard) => OptionalTypeGuard}
 */
const decideOptional = (undef) => {

	// Check for undefined version
	if (undef) {
		return toOptionalUndefined;
	}

	return toOptional;
};

/**
 * Wrapper for partial object and tuple type guards
 * @param {TypeGuard} type
 * @param {boolean} undef
 * @returns {TypeGuard}
 */
const wrapPartial = (type, undef) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'object': {

			// Check for strict object
			if (meta.strict) {

				/** @type {TypeGuard} */
				const check = isStrictObjectOf(
					forMap(meta.shape, decideOptional(undef))
				);

				return check;
			}

			/** @type {TypeGuard} */
			const check = isObjectOf(forMap(meta.shape, decideOptional(undef)));

			return check;
		}

		case 'tuple': {

			/** @type {TypeGuard} */
			const check = isTupleOf(meta.tuple.map(decideOptional(undef)));

			return check;
		}

		default: {
			throw TypeError(invalidPartial);
		}
	}
};

/**
 * Check for values that have all properties strict optional
 * @note Accepts only object and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {TypeGuard<Partial<InferTypeGuard<T>>>}
 */
const isPartial = (type) => wrapPartial(type, false);

/**
 * Check for values that have all properties optional or undefined
 * @note Accepts only object and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {TypeGuard<PartialUndefined<InferTypeGuard<T>>>}
 */
const isPartialUndefined = (type) => wrapPartial(type, true);

module.exports = {
	isPartial,
	isPartialUndefined,
	partial: isPartial,
	partialUndef: isPartialUndefined
};