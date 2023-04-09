import {
	assertBaseClassification,
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
 * @typedef {import('r-assign').InferT<T>} InferType
 */

/**
 * Check for array values
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} [type]
 * @returns {TypeGuard<Promise<InferType<T>>>}
 */
export const isPromiseOf = (type) => {

	const child = getVoidableTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseClassification(child.classification);

	/** @type {TypeGuard<Promise<InferType<T>>>} */
	const check = (value) => (value instanceof Promise);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		child,
		classification: 'promise',
		type
	});

	return check;
};

export { isPromiseOf as promise };