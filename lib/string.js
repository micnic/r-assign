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
 * Check for string values
 * @type {TypeGuard<string>}
 */
export const isString = (value) => (typeof value === 'string');

// Save type guard meta
setTypeGuardMeta(isString, {
	classification: 'primitive',
	primitive: 'string'
});

/**
 * Transform any value to string
 * @type {TransformFunction<string>}
 */
export const asString = (value) => {

	// Check for string values
	if (isString(value)) {
		return value;
	}

	return String(value);
};

export { isString as string };