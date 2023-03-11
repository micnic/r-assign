import { getTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

const allowedTypes = 'are allowed only array, object, record or tuple types';
const invalidSetSame = `Invalid type for "setSame()", ${allowedTypes}`;

/**
 * Set same flag for the provided type guard
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {T} type
 * @param {boolean} [same]
 * @returns {T}
 */
export const setSame = (type, same = true) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'array':
		case 'object':
		case 'record':
		case 'tuple': {

			// Set same flag in type guard meta
			meta.same = same;

			return type;
		}

		default: {
			throw TypeError(invalidSetSame);
		}
	}
};

export { setSame as same };