'use strict';

const { invalidPartial } = require('r-assign/lib/internal/errors');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { isArrayOf } = require('r-assign/lib/array');
const { isObjectOf, isStrictObjectOf } = require('r-assign/lib/object');
const { isOptional, isOptionalUndefined } = require('r-assign/lib/optional');
const { isRecordOf } = require('r-assign/lib/record');
const { isTupleOf } = require('r-assign/lib/tuple');
const { isUndefined } = require('r-assign/lib/undefined');
const { isUnionOf } = require('r-assign/lib/union');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').OTG<T>} OptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').PU<T>} PartialUndefined
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
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
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @typedef {import('r-assign/lib/internal').SE} ShapeEntries
 */

const { fromEntries } = Object;

/**
 * Convert type guard to strict optional type guard
 * @param {TypeGuard} type
 * @returns {OptionalTypeGuard}
 */
const toOptional = (type) => {

	const meta = getTypeGuardMeta(type);

	// Check for optional type guard
	if (meta.classification === 'optional') {

		// Switch optional undefined type guard to strict optional type guard
		if (meta.undef) {
			return isOptional(meta.type);
		}

		return meta.main;
	}

	return isOptional(type);
};

/**
 * Convert entry to strict optional type guard entry
 * @param {[string, TypeGuard]} entry
 * @returns {[string, TypeGuard]}
 */
const toOptionalEntry = (entry) => [entry[0], toOptional(entry[1])];

/**
 * Convert type guard to optional undefined type guard
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
 * Convert entry to optional undefined type guard entry
 * @param {[string, TypeGuard]} entry
 * @returns {[string, TypeGuard]}
 */
const toOptionalUndefinedEntry = (entry) => [
	entry[0],
	toOptionalUndefined(entry[1])
];

/**
 * Decide what optional type guard to use for type guard conversion
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
 * Convert entries to optional type guard entries
 * @param {ShapeEntries} entries
 * @param {boolean} undef
 * @returns {ShapeEntries}
 */
const entriesToOptional = (entries, undef) => {

	// Check for undefined version
	if (undef) {
		return entries.map(toOptionalUndefinedEntry);
	}

	return entries.map(toOptionalEntry);
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

		case 'array': {
			return isArrayOf(isUnionOf([meta.type, isUndefined]));
		}

		case 'object': {

			const shape = fromEntries(entriesToOptional(meta.entries, undef));

			// Check for strict object
			if (meta.strict) {
				return isStrictObjectOf(shape);
			}

			// Check for object with mapping
			if (meta.mapping) {
				return isObjectOf(shape, wrapPartial(meta.mapping, undef));
			}

			return isObjectOf(shape);
		}

		case 'record': {
			return isRecordOf(meta.keys, isUnionOf([meta.values, isUndefined]));
		}

		case 'tuple': {
			return isTupleOf(meta.tuple.map(decideOptional(undef)));
		}

		default: {
			throw TypeError(invalidPartial);
		}
	}
};

/**
 * Check for values that have all properties strict optional
 * @note Accepts only object, record, array and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {TypeGuard<Partial<InferTypeGuard<T>>>}
 */
const isPartial = (type) => wrapPartial(type, false);

/**
 * Check for values that have all properties optional or undefined
 * @note Accepts only object, record, array and tuple type guards
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