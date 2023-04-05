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
 * @typedef {import('r-assign').InferT<T>} InferT
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
 * @returns {TG<InferT<T>>}
 */
const getOptionalTypeGuard = (type, undef) => {

	// Check for undefined optional
	if (undef) {

		const check = isUnionOf([type, isUndefined]);

		/** @type {TG<InferT<T>>} */
		const guard = (value) => check(value);

		return guard;
	}

	/** @type {TG<InferT<T>>} */
	const guard = (value) => type(value);

	return guard;
};

/**
 * Wrapper for optional type guards
 * @template {TG} T
 * @param {BTG<T>} type
 * @param {boolean} undef
 * @param {InferT<T> | (() => InferT<T>)} [def]
 * @returns {OTG<InferT<T>> | ODTG<InferT<T>>}
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
 * @param {InferT<T> | (() => InferT<T>)} [def]
 * @returns {OTG<InferT<T>> | ODTG<InferT<T>>}
 */
export const isOptional = (type, def) => wrapOptional(type, false, def);

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TG} T
 * @param {BTG<T>} type
 * @param {InferT<T> | (() => InferT<T>)} [def]
 * @returns {OTG<InferT<T> | undefined> | ODTG<InferT<T> | undefined>}
 */
export const isOptionalUndefined = (type, def) =>
	wrapOptional(type, true, def);

export { isOptional as optional, isOptionalUndefined as optionalUndef };