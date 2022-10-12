'use strict';

const { getType } = require('r-assign/lib/get-type');
const { hasOneElement } = require('r-assign/lib/internal/array-checks');
const {
	optionalAfterRest,
	requiredAfterOptional,
	restAfterRest
} = require('r-assign/lib/internal/errors');
const {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isArrayOf } = require('r-assign/lib/array');
const { parseType } = require('r-assign/lib/parse-type');

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
 * @template T
 * @typedef {import('r-assign/lib').CTG<T>} CompositeTypeGuard
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').RTG<T>} RestTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @template {Tuple} T
 * @typedef {import('r-assign/lib').InferT<T>} InferTuple
 */

/**
 * @typedef {import ('r-assign/lib/internal').TTGM} TupleTypeGuardMeta
 */

/**
 * @typedef RestTag
 * @property {true} rest
 */

const { isArray } = Array;
const { assign, values } = Object;

const invalidTypeGuards = 'Invalid type guards provided';

/** @type {RestTag} */
const restTag = { rest: true };

/**
 * Get tuple annotation
 * @param {Tuple} tuple
 * @returns {string}
 */
const getTupleAnnotation = (tuple) => `[ ${tuple.map((type) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	switch (classification) {
		case 'optional': {
			return `${annotation}?`;
		}

		default: {
			return annotation;
		}
	}
}).join(', ')} ]`;

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
	for (const [index, type] of tuple.entries()) {

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
const isTupleOf = (types) => {

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

	const annotation = getTupleAnnotation(tuple);
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

		return tuple.every((type, index) => {

			// Check for the end of the value validation
			if (checkIndex === value.length) {
				return (index >= optional);
			}

			// Check for rest validation
			if (index === rest) {

				// Check for required elements after rest
				if (required > rest) {

					const tail = value.length - tuple.length + required;

					// Check till the end of the rest
					if (checkIndex < tail) {
						do {
							if (!type(value[checkIndex++])) {
								return false;
							}
						} while (checkIndex < tail);
					}
				} else {

					// Check till the end of the value
					do {
						if (!type(value[checkIndex++])) {
							return false;
						}
					} while (checkIndex < value.length);
				}

				return true;
			}

			return type(value[checkIndex++]);
		});
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'tuple',
		description: `a tuple of ${annotation}`,
		indexes,
		same: false,
		tuple
	});

	return check;
};

/**
 * Check for tuple rest
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {RestTypeGuard<InferTypeGuard<T>>}
 */
const isTupleRestOf = (type) => {

	const { annotation, classification } = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(classification);

	/** @type {TypeGuard<InferTypeGuard<T>>} */
	const guard = (value) => type(value);

	/** @type {RestTypeGuard<InferTypeGuard<T>>} */
	const check = assign(guard, restTag);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation: `...${annotation}[]`,
		classification: 'rest',
		description: `a rest value of ${annotation}`,
		type
	});

	return check;
};

/**
 * Extract tuple values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Tuple} T
 * @param {T} tuple
 * @param {InferTuple<T>} initial
 * @returns {TransformFunction<InferTuple<T>>}
 */
const getTupleOf = (tuple, initial) => getType(isTupleOf(tuple), initial);

/**
 * Extract and validate tuple values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Tuple} T
 * @param {T} tuple
 * @returns {TransformFunction<InferTuple<T>>}
 */
const parseTupleOf = (tuple) => parseType(isTupleOf(tuple));

module.exports = {
	getTupleOf,
	isTupleOf,
	isTupleRestOf,
	parseTupleOf,
	tuple: isTupleOf,
	tupleRest: isTupleRestOf
};