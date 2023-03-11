import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * Check for boolean values
 * @type {TypeGuard<boolean>}
 */
export const isBoolean = (value) => (typeof value === 'boolean');

// Save type guard meta
setTypeGuardMeta(isBoolean, {
	classification: 'primitive',
	primitive: 'boolean'
});

export { isBoolean as boolean };