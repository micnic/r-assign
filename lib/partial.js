import { getTypeGuardMeta } from './internal/type-guard-meta.js';
import { isArrayOf } from 'r-assign/array';
import { isObjectOf } from 'r-assign/object';
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
 * @typedef {import('r-assign').InferT<T>} InferType
 */

/**
 * @typedef {import('r-assign').Tuple} Tuple
 */

/**
 * @typedef {import('./internal/index.js').TGM} TypeGuardMeta
 */

const { fromEntries } = Object;

const invalidPartial =
	'Partial type can only be applied to object, record, array or tuple types';

/**
 * Convert type guard to strict optional type guard
 * @param {TypeGuardMeta} meta
 * @returns {OptionalTypeGuard}
 */
const toOptional = (meta) => {

	// Check for optional type guard
	if (meta.classification === 'optional') {

		// Switch optional undefined type guard to strict optional type guard
		if (meta.undef) {
			return isOptional(meta.type);
		}

		return meta.check;
	}

	return isOptional(meta.check);
};

/**
 * Convert entry to strict optional type guard entry
 * @param {[string, TypeGuardMeta]} entry
 * @returns {[string, TypeGuardMeta]}
 */
const toOptionalEntry = (entry) => {

	const type = toOptional(entry[1]);

	return [entry[0], getTypeGuardMeta(type)];
};

/**
 * Convert type guard to optional undefined type guard
 * @param {TypeGuardMeta} meta
 * @returns {OptionalTypeGuard}
 */
const toOptionalUndefined = (meta) => {

	// Check for optional type guard
	if (meta.classification === 'optional') {

		// Check for optional undefined type guard
		if (meta.undef) {
			return meta.check;
		}

		return isOptionalUndefined(meta.type);
	}

	return isOptionalUndefined(meta.check);
};

/**
 * Convert entry to optional undefined type guard entry
 * @param {[string, TypeGuardMeta]} entry
 * @returns {[string, TypeGuardMeta]}
 */
const toOptionalUndefinedEntry = (entry) => {

	const type = toOptionalUndefined(entry[1]);

	return [entry[0], getTypeGuardMeta(type)];
};

/**
 * Decide what optional type guard to use for type guard conversion
 * @param {boolean} undef
 * @returns {(type: TypeGuardMeta) => OptionalTypeGuard}
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
 * @param {Map<string, TypeGuardMeta>} entries
 * @param {boolean} undef
 * @returns {Map<string, TypeGuardMeta>}
 */
const entriesToOptional = (entries, undef) => {

	// Check for undefined version
	if (undef) {
		return new Map([...entries].map(toOptionalUndefinedEntry));
	}

	return new Map([...entries].map(toOptionalEntry));
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
			].map(([key, child]) => [key, child.check]));

			return isObjectOf(shape, meta.strict);
		}

		case 'record': {
			return isRecordOf(
				meta.types[0],
				isUnionOf([meta.types[1], isUndefined])
			);
		}

		case 'tuple': {
			return isTupleOf(
				meta.tuple.map(getTypeGuardMeta).map(decideOptional(undef))
			);
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
 * @returns {TypeGuard<Partial<InferType<T>>>}
 */
export const isPartial = (type) => wrapPartial(type, false);

/**
 * Check for values that have all properties optional or undefined
 * @note Accepts only object, record, array and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<PartialUndefined<InferType<T>>>}
 */
export const isPartialUndefined = (type) => wrapPartial(type, true);

export { isPartial as partial, isPartialUndefined as partialUndef };