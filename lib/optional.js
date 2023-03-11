import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isUndefined } from 'r-assign/undefined';
import { isUnionOf } from 'r-assign/union';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').OTG<T>} OptionalTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef OptionalTag
 * @property {true} optional
 */

const { assign } = Object;

/** @type {OptionalTag} */
const optionalTag = { optional: true };

/**
 * Get optional type guard
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {boolean} undef
 * @returns {TypeGuard<InferTypeGuard<T>>}
 */
const getOptionalTypeGuard = (type, undef) => {

	// Check for undefined optional
	if (undef) {

		const check = isUnionOf([type, isUndefined]);

		/** @type {TypeGuard<InferTypeGuard<T>>} */
		const guard = (value) => check(value);

		return guard;
	}

	/** @type {TypeGuard<InferTypeGuard<T>>} */
	const guard = (value) => type(value);

	return guard;
};

/**
 * Wrapper for optional type guards
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {boolean} undef
 * @returns {OptionalTypeGuard<InferTypeGuard<T>>}
 */
const wrapOptional = (type, undef) => {

	const child = getTypeGuardMeta(type);

	// Check for invalid optional
	assertBaseTypeGuard(child.classification);

	const check = assign(getOptionalTypeGuard(type, undef), optionalTag);

	// Save type guard meta
	setTypeGuardMeta(check, {
		child,
		classification: 'optional',
		main: check,
		type,
		undef
	});

	return check;
};

/**
 * Check for strict optional values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T>>}
 */
export const isOptional = (type) => wrapOptional(type, false);

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {OptionalTypeGuard<InferTypeGuard<T> | undefined>}
 */
export const isOptionalUndefined = (type) => wrapOptional(type, true);

export { isOptional as optional, isOptionalUndefined as optionalUndef };