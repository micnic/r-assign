import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

const { isNaN } = Number;

const invalidDate = 'Invalid date value';

/**
 * Check for valid date values
 * @type {TypeGuard<Date>}
 */
export const isDate = (value) => (
	value instanceof Date && !isNaN(value.getTime())
);

// Save type guard meta
setTypeGuardMeta(isDate, {
	builder: Date,
	check: isDate,
	classification: 'instance'
});

/**
 * Transform number or string values to valid date
 * @type {TransformFunction<Date>}
 */
export const asDate = (value) => {

	// Check for date values
	if (isDate(value)) {
		return value;
	}

	// Switch on value type
	switch (typeof value) {

		case 'number':
		case 'string': {

			const date = new Date(value);

			// Check for valid date values
			if (isDate(date)) {
				return date;
			}
		}

		// eslint-disable-next-line no-fallthrough
		default: {
			throw TypeError(invalidDate);
		}
	}
};

export { isDate as date };