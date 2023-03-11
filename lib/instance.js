import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [C = any]
 * @typedef {import('r-assign').Constructor<C>} Constructor
 */

/**
 * @template {Constructor} C
 * @typedef {import('r-assign').InferC<C>} InferConstructor
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

const invalidConstructor = 'Invalid constructor provided';

/**
 * Check for instance values
 * @template {Constructor} C
 * @param {C} builder
 * @returns {TypeGuard<InferConstructor<C>>}
 */
export const isInstanceOf = (builder) => {

	// Check for valid type guard
	if (typeof builder !== 'function') {
		throw TypeError(invalidConstructor);
	}

	/** @type {TypeGuard<InferConstructor<C>>} */
	const check = (value) => (value instanceof builder);

	// Save type guard meta
	setTypeGuardMeta(check, {
		builder,
		classification: 'instance'
	});

	return check;
};

export { isInstanceOf as instance };