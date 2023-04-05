import { invalidValue } from './internal/invalid-type.js';
import {
	assertBaseTypeGuard,
	getTypeGuardMeta
} from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferT<T>} InferType
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * Asserts that the provided value is of the provided type
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {unknown} value
 * @param {string} [message]
 * @returns {asserts value is InferType<T>}
 */
export const assertType = (type, value, message) => {

	const { classification } = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(classification);

	// Check for default value to be of a valid type
	if (!type(value)) {

		// Check for custom error message provided
		if (message) {
			throw TypeError(message);
		}

		throw TypeError(invalidValue(type, value));
	}
};