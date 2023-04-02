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
 * Check for boolean values
 * @type {TypeGuard<boolean>}
 */
export const isBoolean = (value) => (typeof value === 'boolean');

// Save type guard meta
setTypeGuardMeta(isBoolean, {
	check: isBoolean,
	classification: 'primitive',
	primitive: 'boolean'
});

/**
 * Transform any value to boolean
 * @type {TransformFunction<boolean>}
 */
export const asBoolean = (value) => {

	// Check for boolean values
	if (isBoolean(value)) {
		return value;
	}

	return Boolean(value);
};

export { isBoolean as boolean };