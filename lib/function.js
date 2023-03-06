import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	getVoidableTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isPromiseOf } from 'r-assign/promise';
import { isTupleOf } from 'r-assign/tuple';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @typedef {import('r-assign').Tuple} Tuple
 */

/**
 * @template {Tuple} A
 * @template {TypeGuard} R
 * @typedef {import('r-assign').InferAF<A, R>} InferAsyncFunction
 */

/**
 * @template {Tuple} A
 * @template {TypeGuard} R
 * @typedef {import('r-assign').InferF<A, R>} InferFunction
 */

/**
 * @typedef {import('./internal/index.js').TGM} TypeGuardMeta
 */

/**
 * Get input annotation
 * @param {TypeGuardMeta} meta
 * @returns {string}
 */
const getInputAnnotation = (meta) => {

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
 * @param {TypeGuardMeta} meta
 * @returns {string}
 */
const getOutputAnnotation = (meta) => {

	// Assert for base type guard
	assertBaseTypeGuard(meta.classification);

	return meta.annotation;
};

/**
 * Get function annotation
 * @param {TypeGuardMeta} inputMeta
 * @param {TypeGuardMeta} outputMeta
 * @returns {string}
 */
const getFunctionAnnotation = (inputMeta, outputMeta) => {
	return `(${getInputAnnotation(inputMeta)}) => ${getOutputAnnotation(
		outputMeta
	)}`;
};

/**
 * Check for function values
 * @template {Tuple} I
 * @template {TypeGuard} O
 * @param {I} input
 * @param {BaseTypeGuard<O>} [output]
 * @returns {TypeGuard<InferFunction<I, O>>}
 */
export const isFunction = (input, output) => {

	const isInput = isTupleOf(input);
	const inputMeta = getTypeGuardMeta(isInput);
	const outputMeta = getVoidableTypeGuardMeta(output);
	const annotation = getFunctionAnnotation(inputMeta, outputMeta);

	/** @type {TypeGuard<InferFunction<I, O>>} */
	const check = (value) => (typeof value === 'function');

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		children: [inputMeta, outputMeta],
		classification: 'function',
		description: `a function ${annotation}`,
		types: [isInput, output]
	});

	return check;
};

/**
 * Check for async function values
 * @template {Tuple} I
 * @template {TypeGuard} O
 * @param {I} input
 * @param {BaseTypeGuard<O>} [output]
 * @returns {TypeGuard<InferAsyncFunction<I, O>>}
 */
export const isAsyncFunction = (input, output) =>
	isFunction(input, isPromiseOf(output));

export { isAsyncFunction as asyncFunc, isFunction as func };