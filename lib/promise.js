'use strict';

const {
	assertBaseTypeGuard,
	getVoidableTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

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
 * Check for array values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} [type]
 * @returns {TypeGuard<Promise<InferTypeGuard<T>>>}
 */
const isPromiseOf = (type) => {

	const child = getVoidableTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(child.classification);

	/** @type {TypeGuard<Promise<InferTypeGuard<T>>>} */
	const check = (value) => (value instanceof Promise);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation: `Promise<${child.annotation}>`,
		child,
		classification: 'promise',
		description: `a promise of ${child.annotation}`,
		type
	});

	return check;
};

module.exports = {
	isPromiseOf,
	promise: isPromiseOf
};