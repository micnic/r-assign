import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isUndefined } from 'r-assign/undefined';
import { isUnionOf } from 'r-assign/union';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TG
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').OTG<T>} OTG
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').ODTG<T>} ODTG
 */

/**
 * @template {TG} T
 * @typedef {import('r-assign').BTG<T>} BTG
 */

/**
 * @template {TG} T
 * @typedef {import('r-assign').InferTG<T>} InferTG
 */

/**
 * @typedef OptionalTag
 * @property {true} optional
 */

/**
 * @typedef DefaultTag
 * @property {true} default
 */

const { assign } = Object;

/** @type {OptionalTag} */
const optionalTag = { optional: true };

/** @type {DefaultTag} */
const defaultTag = { default: true };

/**
 * Get optional type guard
 * @template {TG} T
 * @param {BTG<T>} type
 * @param {boolean} undef
 * @returns {TG<InferTG<T>>}
 */
const getOptionalTypeGuard = (type, undef) => {

	// Check for undefined optional
	if (undef) {

		const check = isUnionOf([type, isUndefined]);

		/** @type {TG<InferTG<T>>} */
		const guard = (value) => check(value);

		return guard;
	}

	/** @type {TG<InferTG<T>>} */
	const guard = (value) => type(value);

	return guard;
};

/**
 * Wrapper for optional type guards
 * @template {TG} T
 * @param {BTG<T>} type
 * @param {boolean} undef
 * @param {InferTG<T> | (() => InferTG<T>)} [def]
 * @returns {OTG<InferTG<T>> | ODTG<InferTG<T>>}
 */
const wrapOptional = (type, undef, def) => {

	const child = getTypeGuardMeta(type);

	// Check for invalid optional
	assertBaseTypeGuard(child.classification);

	const guard = getOptionalTypeGuard(type, undef);

	// Check for optional without default value
	if (def === undefined) {

		const check = assign(guard, optionalTag);

		// Save type guard meta
		setTypeGuardMeta(check, {
			check,
			child,
			classification: 'optional',
			type,
			undef
		});

		return check;
	}

	const check = assign(guard, optionalTag, defaultTag);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		child,
		classification: 'optional',
		def,
		type,
		undef
	});

	return check;
};

/**
 * Check for strict optional values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TG} T
 * @param {BTG<T>} type
 * @param {InferTG<T> | (() => InferTG<T>)} [def]
 * @returns {OTG<InferTG<T>> | ODTG<InferTG<T>>}
 */
export const isOptional = (type, def) => wrapOptional(type, false, def);

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TG} T
 * @param {BTG<T>} type
 * @param {InferTG<T> | (() => InferTG<T>)} [def]
 * @returns {OTG<InferTG<T> | undefined> | ODTG<InferTG<T> | undefined>}
 */
export const isOptionalUndefined = (type, def) =>
	wrapOptional(type, true, def);

export { isOptional as optional, isOptionalUndefined as optionalUndef };