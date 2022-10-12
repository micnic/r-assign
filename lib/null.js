'use strict';

const { getType } = require('r-assign/lib/get-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');
const { isUndefined } = require('r-assign/lib/undefined');
const { isUnionOf } = require('r-assign/lib/union');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').BTG<T>} BaseTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * Check for null values
 * @type {TypeGuard<null>}
 */
const isNull = (value) => (value === null);

// Save type guard meta
setTypeGuardMeta(isNull, {
	annotation: 'null',
	classification: 'literal',
	description: 'a null value',
	literal: null
});

/**
 * Check for nullable values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<InferTypeGuard<T> | null>}
 */
const isNullable = (type) => isUnionOf([type, isNull]);

/**
 * Check for nullish values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<InferTypeGuard<T> | null | undefined>}
 */
const isNullish = (type) => isUnionOf([type, isNull, isUndefined]);

/**
 * Extract null values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @type {TransformFunction<null>}
 */
const getNull = () => null;

/**
 * Extract nullable values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TransformFunction<InferTypeGuard<T> | null>}
 */
const getNullable = (type) => getType(isNullable(type), null);

/**
 * Extract and validate null values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<null>}
 */
const parseNull = parseType(isNull);

/**
 * Extract and validate nullable values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TransformFunction<InferTypeGuard<T> | null>}
 */
const parseNullable = (type) => parseType(isNullable(type));

module.exports = {
	getNull,
	getNullable,
	isNull,
	isNullable,
	isNullish,
	nullable: isNullable,
	nulled: isNull,
	nullish: isNullish,
	parseNull,
	parseNullable
};