import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

const invalidBigInt = 'Invalid BigInt value';

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

/**
 * Transform any value to BigInt
 * @type {TransformFunction<bigint>}
 */
export const asBigInt = (value) => {

	// Check for BigInt values
	if (isBigInt(value)) {
		return value;
	}

	// Switch on value type
	switch (typeof value) {

		case 'boolean':
		case 'number':
		case 'string': {

			const bigint = BigInt(value);

			// Check for BigInt values
			if (isBigInt(bigint)) {
				return bigint;
			}
		}

		// eslint-disable-next-line no-fallthrough
		default: {
			throw TypeError(invalidBigInt);
		}
	}
};

export { isBigInt as bigint };