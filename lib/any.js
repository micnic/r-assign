import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign').ATG} AnyTypeGuard
 */

/**
 * @typedef AnyTag
 * @property {true} any
 */

const { assign } = Object;

/** @type {AnyTag} */
const anyTag = { any: true };

/** @type {TypeGuard} */
const guard = () => true;

/**
 * Check for any values
 * @type {AnyTypeGuard}
 */
export const isAny = assign(guard, anyTag);

// Save type guard meta
setTypeGuardMeta(isAny, {
	annotation: 'any',
	classification: 'any',
	description: 'any value'
});

export { isAny as any };