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

const invalidNumber = 'Invalid number value';

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

/**
 * Transform any value to number
 * @type {TransformFunction<number>}
 */
export const asNumber = (value) => {

	// Check for number values
	if (isNumber(value)) {
		return value;
	}

	const number = Number(value);

	// Check for number values
	if (isNumber(number)) {
		return number;
	}

	throw TypeError(invalidNumber);
};

export { isNumber as number };