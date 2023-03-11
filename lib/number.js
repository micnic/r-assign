import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

const { isFinite } = Number;

/**
 * Check for finite number values
 * @type {TypeGuard<number>}
 */
export const isNumber = (value) => (
	typeof value === 'number' && isFinite(value)
);

// Save type guard meta
setTypeGuardMeta(isNumber, {
	classification: 'primitive',
	finite: true,
	primitive: 'number'
});

export { isNumber as number };