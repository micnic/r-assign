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
 * Check for symbol values
 * @type {TypeGuard<symbol>}
 */
export const isSymbol = (value) => (typeof value === 'symbol');

// Save type guard meta
setTypeGuardMeta(isSymbol, {
	annotation: 'symbol',
	classification: 'primitive',
	description: 'a symbol value',
	primitive: 'symbol'
});

export { isSymbol as symbol };