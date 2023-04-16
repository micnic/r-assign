import { hasAtLeastOneElement } from './internal/array-checks.js';
import {
	assertBaseClassification,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isLiteralOf } from 'r-assign/literal';
import { isNever } from 'r-assign/never';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').OTG<T>} OptionalTypeGuard
 */

/**
 * @typedef {import('r-assign').Shape} Shape
 */

/**
 * @typedef {import('./internal/index.js').TGM} TGM
 */

/**
 * @typedef {import('./internal/index.js').BTGM} BaseTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').OTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').OPTGM} OptionalTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').RETGM} RestTypeGuardMeta
 */

/**
 * @template {Shape} S
 * @typedef {import('r-assign').InferS<S>} InferShape
 */

const { isArray } = Array;
const { entries, fromEntries, keys } = Object;

const expectedKeys = 'expected strings or array of strings';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidObjectType = 'Invalid type provided, expected an object type';
const invalidShape = 'Invalid shape provided';

/**
 * Check for keys of provided object type
 * @template {Record<keyof any, any>} R
 * @param {TypeGuard<R>} type
 * @returns {TypeGuard<keyof R>}
 */
export const isKeyOf = (type) => {

	const meta = getTypeGuardMeta(type);

	// Check for object type guard
	if (meta.classification !== 'object') {
		throw TypeError(invalidObjectType);
	}

	// Check for at least one property in object schema
	if (hasAtLeastOneElement(meta.keys)) {

		/** @type {TypeGuard<keyof R>} */
		const check = isLiteralOf(meta.keys);

		return check;
	}

	return isNever;
};

/**
 * Check for object values
 * @template {Shape} S
 * @param {S} shape
 * @param {boolean} [strict = false]
 * @returns {TypeGuard<InferShape<S>>}>}
 */
export const isObjectOf = (shape, strict = false) => {

	// Check for non-object shapes
	if (shape === null || typeof shape !== 'object') {
		throw TypeError(invalidShape);
	}

	const shapeKeys = keys(shape);

	/** @type {Map<string, BaseTypeGuardMeta>} */
	const required = new Map();

	/** @type {Map<string, OptionalTypeGuardMeta>} */
	const optional = new Map();

	let optionalDefault = false;

	const all = new Map(
		entries(shape)
			.map(([ key, type ]) => {
				const child = getTypeGuardMeta(type);

				// Check for optional properties
				if (child.classification === 'optional') {

					// Add child meta to optional map
					optional.set(key, child);

					// Check for optional default value
					if (child.def !== undefined) {
						optionalDefault = true;
					}
				} else {

					// Assert base type
					assertBaseClassification(child.classification);

					// Add child meta to required map
					required.set(key, child);
				}

				/** @type {[string, Exclude<TGM, RestTypeGuardMeta>]} */
				const entry = [key, child];

				return entry;
			})
			.sort(([first], [second]) => first.localeCompare(second))
	);

	// Check for optional default value to disable type checking
	if (optionalDefault) {

		/** @type {TypeGuard} */
		const check = () => {
			throw TypeError(
				'Optional type with default value cannot used for type checking'
			);
		};

		// Save type guard meta
		setTypeGuardMeta(check, {
			all,
			check,
			classification: 'object',
			keys: shapeKeys,
			optional,
			required,
			strict
		});

		return check;
	}

	/** @type {TypeGuard<InferShape<S>>} */
	const check = (value) => {

		// Check for non-object values
		if (value === null || typeof value !== 'object') {
			return false;
		}

		let expected = required.size;

		// Loop through all value keys
		for (const key in value) {

			const child = all.get(key);

			// Check for known keys
			if (child) {

				const prop = value[key];

				// Check property type
				if (!child.check(prop)) {
					if (
						child.classification !== 'optional' ||
						prop !== undefined ||
						!child.undef
					) {
						return false;
					}
				} else if (child.classification !== 'optional') {
					expected--;
				}
			} else if (strict) {
				return false;
			}
		}

		// Check for missing required keys
		if (expected > 0) {
			return false;
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		all,
		check,
		classification: 'object',
		keys: shapeKeys,
		optional,
		required,
		strict
	});

	return check;
};

/**
 * Check for a subset object value
 * @template {Record<string, any>} R
 * @template {keyof R} K
 * @param {TypeGuard<R>} type
 * @param {K | K[]} names
 * @param {boolean} pick
 * @returns {TypeGuard}
 */
const isPartFrom = (type, names, pick) => {

	const meta = getTypeGuardMeta(type);

	// Check for object type
	if (meta.classification !== 'object') {
		throw TypeError(invalidObjectType);
	}

	// Check for valid names type guard
	if (
		typeof names !== 'string' &&
		!(isArray(names) && names.some((name) => (typeof name === 'string')))
	) {
		throw TypeError(invalidKeysType);
	}

	const shape = fromEntries(
		[...meta.all]
			.map(([key, child]) => [key, child.check])
			.filter(([key]) => {

				// Check for key array
				if (isArray(names)) {
					// Check for pick mode
					if (pick) {
						return names.some((name) => (key === name));
					}

					return !names.some((name) => (key === name));
				}

				// Check for pick mode
				if (pick) {
					return key === names;
				}

				return key !== names;
			})
	);

	/** @type {TypeGuard} */
	const check = isObjectOf(shape, meta.strict);

	return check;
};

/**
 * Check for a subset object value by omitting the provided keys
 * @template {Record<string, any>} R
 * @template {keyof R} K
 * @param {TypeGuard<R>} type
 * @param {K | K[]} names
 * @returns {TypeGuard<Omit<R, K>>}
 */
export const isOmitFrom = (type, names) => isPartFrom(type, names, false);

/**
 * Check for a subset object value by picking the provided keys
 * @template {Record<keyof any, any>} R
 * @template {keyof R} K
 * @param {TypeGuard<R>} type
 * @param {K | K[]} names
 * @returns {TypeGuard<Pick<R, K>>}
 */
export const isPickFrom = (type, names) => isPartFrom(type, names, true);

export {
	isKeyOf as keyof,
	isObjectOf as object,
	isOmitFrom as omit,
	isPickFrom as pick
};