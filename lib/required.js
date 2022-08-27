'use strict';

const { invalidRequired } = require('r-assign/lib/internal/errors');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { isObjectOf, isStrictObjectOf } = require('r-assign/lib/object');
const { isTupleOf } = require('r-assign/lib/tuple');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
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
 * @typedef {import('r-assign/lib/internal').SE} ShapeEntries
 */

const { fromEntries } = Object;

/**
 * Convert type guard to required type guard
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
 * Convert entry to required type guard entry
 * @param {[string, TypeGuard]} entry
 * @returns {[string, TypeGuard]}
 */
const toRequiredEntry = (entry) => [entry[0], toRequired(entry[1])];

/**
 * Convert entries to optional type guard entries
 * @param {ShapeEntries} entries
 * @returns {ShapeEntries}
 */
const entriesToRequired = (entries) => entries.map(toRequiredEntry);

/**
 * Check for values that have all properties required
 * @note Accepts only object and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<Required<InferTypeGuard<T>>>}
 */
const isRequired = (type) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'object': {

			const shape = fromEntries([
				...meta.required,
				...entriesToRequired(meta.optional)
			]);

			// Check for strict object
			if (meta.strict) {

				/** @type {TypeGuard} */
				const check = isStrictObjectOf(shape);

				return check;
			}

			// Check for object with mapping
			if (meta.mapping) {

				/** @type {TypeGuard} */
				const check = isObjectOf(shape, meta.mapping);

				return check;
			}

			/** @type {TypeGuard} */
			const check = isObjectOf(shape);

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