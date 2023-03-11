import {
	assertBaseTypeGuard,
	getVoidableTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';

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
 * Check for array values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} [type]
 * @returns {TypeGuard<Promise<InferTypeGuard<T>>>}
 */
export const isPromiseOf = (type) => {

	const child = getVoidableTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(child.classification);

	/** @type {TypeGuard<Promise<InferTypeGuard<T>>>} */
	const check = (value) => (value instanceof Promise);

	// Save type guard meta
	setTypeGuardMeta(check, {
		child,
		classification: 'promise',
		type
	});

	return check;
};

export { isPromiseOf as promise };