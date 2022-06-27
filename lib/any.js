'use strict';

const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef AnyTag
 * @property {true} any
 */

const { assign } = Object;

/** @type {AnyTag} */
const anyTag = { any: true };

/** @type {TypeGuard} */
const guard = () => true;

/**
 * Check for any values
 * @type {TypeGuard}
 */
const isAny = assign(guard, anyTag);

// Save type guard meta
setTypeGuardMeta(isAny, {
	annotation: 'any',
	classification: 'any',
	description: 'any value'
});

/**
 * Extract any values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @type {TransformFunction}
 */
const getAny = (value) => value;

/**
 * Extract and validate any values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction}
 */
const parseAny = getAny;

module.exports = {
	any: isAny,
	getAny,
	isAny,
	parseAny
};