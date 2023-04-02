import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * Check for symbol values
 * @type {TypeGuard<symbol>}
 */
export const isSymbol = (value) => (typeof value === 'symbol');

// Save type guard meta
setTypeGuardMeta(isSymbol, {
	check: isSymbol,
	classification: 'primitive',
	primitive: 'symbol'
});

export { isSymbol as symbol };