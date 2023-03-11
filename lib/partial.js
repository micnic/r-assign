import { getTypeGuardMeta } from './internal/type-guard-meta.js';
import { isArrayOf } from 'r-assign/array';
import { isObjectOf, setStrict } from 'r-assign/object';
import { isOptional, isOptionalUndefined } from 'r-assign/optional';
import { isRecordOf } from 'r-assign/record';
import { isTupleOf } from 'r-assign/tuple';
import { isUndefined } from 'r-assign/undefined';
import { isUnionOf } from 'r-assign/union';

/**
 * @template [T = any]
 * @typedef {import('r-assign').OTG<T>} OptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign').PU<T>} PartialUndefined
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign').Tuple} Tuple
 */

/**
 * @typedef {import('./internal/index.js').SE} ShapeEntries
 */

const { fromEntries } = Object;

const invalidPartial =
	'Partial type can only be applied to object, record, array or tuple types';

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

			const shape = fromEntries([
				...entriesToOptional(meta.required, undef),
				...meta.optional
			]);

			// Check for strict object
			if (meta.strict) {
				return setStrict(isObjectOf(shape));
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
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<Partial<InferTypeGuard<T>>>}
 */
export const isPartial = (type) => wrapPartial(type, false);

/**
 * Check for values that have all properties optional or undefined
 * @note Accepts only object, record, array and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<PartialUndefined<InferTypeGuard<T>>>}
 */
export const isPartialUndefined = (type) => wrapPartial(type, true);

export { isPartial as partial, isPartialUndefined as partialUndef };