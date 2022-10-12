'use strict';

const {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isTupleOf } = require('r-assign/lib/tuple');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').BTG<T>} BaseTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @template {Tuple} A
 * @template {TypeGuard} R
 * @typedef {import('r-assign/lib').InferF<A, R>} InferFunction
 */

/**
 * Get input annotation
 * @template {TypeGuard} I
 * @param {I} input
 * @returns {string}
 */
const getInputAnnotation = (input) => {

	const meta = getTypeGuardMeta(input);

	// Switch on input classification
	switch (meta.classification) {

		case 'array': {
			return `...args: ${meta.annotation}`;
		}

		case 'tuple': {

			// Check for empty tuple
			if (meta.tuple.length === 0) {
				return '';
			}

			const { required, rest } = meta.indexes;

			// Check for required arguments after rest
			if (rest >= 0 && required > rest) {
				return `...args: ${meta.annotation}`;
			}

			return meta.tuple.map((type, index) => {

				const { annotation, classification } = getTypeGuardMeta(type);

				// Check for optional type
				if (classification === 'optional') {
					return `arg_${index}?: ${annotation}`;
				}

				return `arg_${index}: ${annotation}`;
			}).join(', ');
		}

		/* istanbul ignore next */
		default: {
			throw TypeError('Invalid function arguments');
		}
	}
};

/**
 * Get output annotation
 * @template {TypeGuard} O
 * @param {O} [output]
 * @returns {string}
 */
const getOutputAnnotation = (output) => {

	// Check for non-void output
	if (output) {

		const { annotation, classification } = getTypeGuardMeta(output);

		// Assert for base type guard
		assertBaseTypeGuard(classification);

		return annotation;
	}

	return 'void';
};

/**
 * Get function annotation
 * @template {TypeGuard} I
 * @template {TypeGuard} O
 * @param {I} input
 * @param {O} [output]
 * @returns {string}
 */
const getFunctionAnnotation = (input, output) => {
	return `(${getInputAnnotation(input)}) => ${getOutputAnnotation(output)}`;
};

/**
 * Check for function values
 * @template {Tuple} I
 * @template {TypeGuard} O
 * @param {I} input
 * @param {BaseTypeGuard<O>} [output]
 * @returns {TypeGuard<InferFunction<I, O>>}
 */
const isFunction = (input, output) => {

	const isInput = isTupleOf(input);
	const annotation = getFunctionAnnotation(isInput, output);

	/** @type {TypeGuard<InferFunction<I, O>>} */
	const check = (value) => (typeof value === 'function');

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'function',
		description: `a function ${annotation}`,
		input: isInput,
		output
	});

	return check;
};

module.exports = {
	func: isFunction,
	isFunction
};