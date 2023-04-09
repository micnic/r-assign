import { hasOneElement } from './internal/array-checks.js';
import {
	assertBaseClassification,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isArrayOf } from 'r-assign/array';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').RTG<T>} RestTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferT<T>} InferType
 */

/**
 * @typedef {import('r-assign').Tuple} Tuple
 */

/**
 * @template {Tuple} T
 * @typedef {import('r-assign').InferTU<T>} InferTuple
 */

/**
 * @typedef {import ('./internal/index.js').TTGM} TupleTypeGuardMeta
 */

/**
 * @typedef RestTag
 * @property {true} rest
 */

const { isArray } = Array;
const { assign, values } = Object;

const elementCantFollow = 'element cannot follow a';
const invalidTypeGuards = 'Invalid type guards provided';
const optionalAfterRest = `An optional ${elementCantFollow} rest element`;
const requiredAfterOptional = `A required ${
	elementCantFollow
}n optional element`;
const restAfterRest = `A rest ${elementCantFollow}nother rest element`;

/** @type {RestTag} */
const restTag = { rest: true };

/**
 * Get optional, required and rest indexes for the provided tuple
 * @param {Tuple} tuple
 * @returns {TupleTypeGuardMeta['indexes']}
 */
const getTupleIndexes = (tuple) => {

	const indexes = {
		optional: -1,
		required: -1,
		rest: -1
	};

	// Validate provided type guards
	for (const [ index, type ] of tuple.entries()) {

		const { classification } = getTypeGuardMeta(type);

		// Switch on type classification
		switch (classification) {

			case 'optional': {

				// Check for optional type on invalid index
				if (indexes.rest >= 0) {
					throw TypeError(optionalAfterRest);
				}

				// Set optional index
				if (indexes.optional < 0) {
					indexes.optional = index;
				}

				break;
			}

			case 'rest': {

				// Check for rest type on invalid index
				if (indexes.rest >= 0) {
					throw TypeError(restAfterRest);
				}

				// Set rest index
				indexes.rest = index;

				break;
			}

			default: {

				// Check for required type after optional
				if (indexes.optional >= 0) {
					throw TypeError(requiredAfterOptional);
				}

				// Set required index
				if (indexes.rest >= 0) {

					// Set required index only for the first element after rest
					if (indexes.required < indexes.rest) {
						indexes.required = index;
					}
				} else {
					indexes.required = index;
				}

				break;
			}
		}
	}

	return indexes;
};

/**
 * Check for tuple values
 * @template {Tuple} T
 * @param {T} types
 * @returns {TypeGuard<InferTuple<T>>}
 */
export const isTupleOf = (types) => {

	// Check for valid type guards provided
	if (!isArray(types)) {
		throw TypeError(invalidTypeGuards);
	}

	/** @type {Tuple} */
	const tuple = values(types);

	// Check for only one rest element in tuple to return an array type guard
	if (hasOneElement(tuple)) {

		const meta = getTypeGuardMeta(tuple[0]);

		// Check for rest type guard
		if (meta.classification === 'rest') {

			/** @type {TypeGuard} */
			const check = isArrayOf(meta.type);

			return check;
		}
	}

	const indexes = getTupleIndexes(tuple);
	const { optional, required, rest } = indexes;

	/** @type {TypeGuard<InferTuple<T>>} */
	const check = (value) => {

		// Check for non-array values or invalid array length
		if (!isArray(value)) {
			return false;
		}

		// Check if value is allowed to be empty
		if (value.length === 0) {
			return (optional === 0 || tuple.length === 0);
		}

		// Check for empty tuple
		if (tuple.length === 0) {
			return false;
		}

		let checkIndex = 0;

		return (
			tuple.every((type, index) => {
				// Check for the end of the value validation
				if (checkIndex === value.length) {

					// Check for optional validation
					if (optional >= 0) {
						return index >= optional;
					}

					// Check for rest validation
					if (rest >= 0) {
						return index >= rest;
					}
				}

				// Check for rest validation
				if (index === rest) {

					let stop = value.length;

					if (required > rest) {
						stop += required - tuple.length;
					}


					// Check till the end of the rest
					while (checkIndex < stop) {

						if (!type(value[checkIndex])) {
							return false;
						}

						checkIndex++;
					}

					return true;
				}

				return type(value[checkIndex++]);
			}) && checkIndex === value.length
		);
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		children: tuple.map(getTypeGuardMeta),
		classification: 'tuple',
		indexes,
		tuple
	});

	return check;
};

/**
 * Check for tuple rest
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {RestTypeGuard<InferType<T>>}
 */
export const isTupleRestOf = (type) => {

	const child = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseClassification(child.classification);

	/** @type {TypeGuard<InferType<T>>} */
	const guard = (value) => type(value);

	/** @type {RestTypeGuard<InferType<T>>} */
	const check = assign(guard, restTag);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		child,
		classification: 'rest',
		type
	});

	return check;
};

export { isTupleOf as tuple, isTupleRestOf as tupleRest };