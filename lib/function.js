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

	// Assert output type guard
	assertBaseTypeGuard(outputMeta.classification);

	/** @type {TypeGuard<InferFunction<I, O>>} */
	const check = (value) => (typeof value === 'function');

	// Save type guard meta
	setTypeGuardMeta(check, {
		children: [inputMeta, outputMeta],
		classification: 'function',
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