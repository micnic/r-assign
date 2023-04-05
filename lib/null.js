import { setTypeGuardMeta } from './internal/type-guard-meta.js';
import { isUndefined } from 'r-assign/undefined';
import { isUnionOf } from 'r-assign/union';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferT<T>} InferType
 */

/**
 * Check for null values
 * @type {TypeGuard<null>}
 */
export const isNull = (value) => (value === null);

// Save type guard meta
setTypeGuardMeta(isNull, {
	check: isNull,
	classification: 'literal',
	literal: null
});

/**
 * Check for nullable values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<InferType<T> | null>}
 */
export const isNullable = (type) => isUnionOf([type, isNull]);

/**
 * Check for nullish values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<InferType<T> | null | undefined>}
 */
export const isNullish = (type) => isUnionOf([type, isNull, isUndefined]);

export { isNull as nulled, isNullable as nullable, isNullish as nullish };