import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

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
	annotation: 'number',
	classification: 'primitive',
	description: 'a finite number value',
	finite: true,
	primitive: 'number'
});

export { isNumber as number };