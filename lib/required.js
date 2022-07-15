'use strict';

const { invalidRequired } = require('r-assign/lib/internal/errors');
const { forMap } = require('r-assign/lib/internal/object-utils');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { isObjectOf, isStrictObjectOf } = require('r-assign/lib/object');
const { isTupleOf } = require('r-assign/lib/tuple');

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
 * @returns {TypeGuard}
 */
const toRequired = (type) => {

	const meta = getTypeGuardMeta(type);

	// Check for optional type guard
	if (meta.classification === 'optional') {

		return meta.type;
	}

	return type;
};

/**
 * Check for values that have all properties required
 * @note Accepts only object and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {TypeGuard<Required<InferTypeGuard<T>>>}
 */
const isRequired = (type) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'object': {

			// Check for strict object
			if (meta.strict) {

				/** @type {TypeGuard} */
				const check = isStrictObjectOf(forMap(meta.shape, toRequired));

				return check;
			}

			/** @type {TypeGuard} */
			const check = isObjectOf(forMap(meta.shape, toRequired));

			return check;
		}

		case 'tuple': {

			/** @type {TypeGuard} */
			const check = isTupleOf(meta.tuple.map(toRequired));

			return check;
		}

		default: {
			throw TypeError(invalidRequired);
		}
	}
};

module.exports = {
	isRequired,
	required: isRequired
};