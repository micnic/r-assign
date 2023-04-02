import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * Check for never
 * @type {TypeGuard<never>}
 */
export const isNever = () => false;

// Save type guard meta
setTypeGuardMeta(isNever, { check: isNever, classification: 'never' });

export { isNever as never };