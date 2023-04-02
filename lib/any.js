import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * Check for any values
 * @type {TypeGuard}
 */
export const isAny = () => true;

// Save type guard meta
setTypeGuardMeta(isAny, { check: isAny, classification: 'any' });

export { isAny as any };