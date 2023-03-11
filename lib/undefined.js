import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * Check for undefined values
 * @type {TypeGuard<undefined>}
 */
export const isUndefined = (value) => (value === undefined);

// Save type guard meta
setTypeGuardMeta(isUndefined, {
	classification: 'literal',
	literal: undefined
});

export { isUndefined as undef };