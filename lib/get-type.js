import { invalidDefaultValue } from './internal/invalid-type.js';
import { pickValue, refineValue } from './internal/pick-value.js';
import {
	assertBaseClassification,
	getTypeGuardMeta
} from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferT<T>} InferType
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign').RF<T>} RefineFunction
 */

/**
 * Extract values based on provided type guard and default value
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {InferType<T> | (() => InferType<T>)} def
 * @param {RefineFunction<InferType<T>>} [refine]
 * @returns {TransformFunction<InferType<T>>}
 */
export const getType = (type, def, refine) => {

	const meta = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseClassification(meta.classification);

	const getDefault = (validate = false) => {

		// Check for initial value getter
		if (typeof def === 'function') {

			// Just validate initial value getter
			if (validate) {
				return undefined;
			}

			/** @type {() => InferType<T>} */
			const getter = def;
			const result = getter();

			// Check for valid initial value type
			if (!type(result)) {
				throw TypeError(invalidDefaultValue(meta, result));
			}

			return result;
		}

		// Check for valid initial value type
		if (!type(def)) {
			throw TypeError(invalidDefaultValue(meta, def));
		}

		return def;
	};

	// Validate initial value getter
	getDefault(true);

	// Check for refine function to optimize performance on value processing
	if (refine) {
		return (value) => {

			// Check for valid value type
			if (type(value)) {
				return refineValue(pickValue(value, meta), meta, refine);
			}

			return refineValue(pickValue(getDefault(), meta), meta, refine);
		};
	}

	return (value) => {

		// Check for valid value type
		if (type(value)) {
			return pickValue(value, meta);
		}

		return pickValue(getDefault(), meta);
	};
};