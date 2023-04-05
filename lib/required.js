import { getTypeGuardMeta } from './internal/type-guard-meta.js';
import { isObjectOf, setStrict } from 'r-assign/object';
import { isTupleOf } from 'r-assign/tuple';

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
 * @typedef {import('./internal/index.js').TGM} TypeGuardMeta
 */

const { fromEntries } = Object;

const invalidRequired =
	'Required type can only be applied to object or tuple types';

/**
 * Convert type guard to required type guard
 * @param {TypeGuardMeta} meta
 * @returns {TypeGuard}
 */
const toRequired = (meta) => {

	// Check for optional type guard
	if (meta.classification === 'optional') {
		return meta.type;
	}

	return meta.check;
};

/**
 * Convert entry to required type guard entry
 * @param {[string, TypeGuardMeta]} entry
 * @returns {[string, TypeGuardMeta]}
 */
const toRequiredEntry = (entry) => [
	entry[0],
	getTypeGuardMeta(toRequired(entry[1]))
];

/**
 * Convert entries to optional type guard entries
 * @param {Map<string, TypeGuardMeta>} entries
 * @returns {Map<string, TypeGuardMeta>}
 */
const entriesToRequired = (entries) =>
	new Map([...entries].map(toRequiredEntry));

/**
 * Check for values that have all properties required
 * @note Accepts only object and tuple type guards
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<Required<InferType<T>>>}
 */
export const isRequired = (type) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'object': {

			const shape = fromEntries(
				[...meta.required, ...entriesToRequired(meta.optional)].map(
					([key, child]) => [key, child.check]
				)
			);

			// Check for strict object
			if (meta.strict) {

				/** @type {TypeGuard} */
				const check = setStrict(isObjectOf(shape));

				return check;
			}

			/** @type {TypeGuard} */
			const check = isObjectOf(shape);

			return check;
		}

		case 'tuple': {

			/** @type {TypeGuard} */
			const check = isTupleOf(
				meta.tuple.map(getTypeGuardMeta).map(toRequired)
			);

			return check;
		}

		default: {
			throw TypeError(invalidRequired);
		}
	}
};

export { isRequired as required };