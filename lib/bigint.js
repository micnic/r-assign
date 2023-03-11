import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * Check for BigInt values
 * @type {TypeGuard<bigint>}
 */
export const isBigInt = (value) => (typeof value === 'bigint');

// Save type guard meta
setTypeGuardMeta(isBigInt, {
	classification: 'primitive',
	primitive: 'bigint'
});

export { isBigInt as bigint };