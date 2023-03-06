import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

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
 * @typedef {import('r-assign').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('./internal/index.js').TC} TypeClassification
 */

const { isArray } = Array;

/**
 * Get array description based on the provided annotation and classification
 * @param {string} annotation
 * @param {TypeClassification} classification
 * @returns {string}
 */
const getArrayDescription = (annotation, classification) => {

	const description = `an array of ${annotation}`;

	// Add plural for primitive annotation
	if (classification === 'primitive') {
		return `${description}s`;
	}

	return description;
};

/**
 * Check for array values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<InferTypeGuard<T>[]>}
 */
export const isArrayOf = (type) => {

	const child = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(child.classification);

	/** @type {TypeGuard<InferTypeGuard<T>[]>} */
	const check = (value) => {

		// Check for non-array values
		if (!isArray(value)) {
			return false;
		}

		// Loop array elements to check them
		for (const element of value) {
			if (!type(element)) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation: `${child.annotation}[]`,
		child,
		classification: 'array',
		description: getArrayDescription(
			child.annotation,
			child.classification
		),
		same: false,
		type
	});

	return check;
};

export { isArrayOf as array };