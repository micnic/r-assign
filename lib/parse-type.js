import { pickValue, refineValue } from './internal/pick-value.js';
import {
	assertBaseTypeGuard,
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
 * Extract and validate values based on the provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {RefineFunction<InferType<T>>} [refine]
 * @returns {TransformFunction<InferType<T>>}
 */
export const parseType = (type, refine) => {

	const meta = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(meta.classification);

	// Check for refine function to optimize performance on value processing
	if (refine) {
		return (value) => refineValue(pickValue(value, meta), type, refine);
	}

	return (value) => pickValue(value, meta);
};