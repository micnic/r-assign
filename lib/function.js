'use strict';

const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isTupleOf } = require('r-assign/lib/tuple');

/**
 * @template A
 * @template R
 * @typedef {import('r-assign/lib').InferFunction<A, R>} InferFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').NOTG<T>} NotOptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * Get arguments annotation
 * @template {Tuple} A
 * @param {A} args
 * @returns {string}
 */
const getArgumentsAnnotation = (args) => {

	return `(${args.map((arg, index) => {

		const { annotation, classification } = getTypeGuardMeta(arg);

		// Check for optional type
		if (classification === 'optional') {
			return `arg_${index}?: ${annotation}`;
		}

		return `arg_${index}: ${annotation}`;
	}).join(', ')})`;
};

/**
 * Get result annotation
 * @template {TypeGuard<any>} R
 * @param {NotOptionalTypeGuard<R>} [result]
 * @returns {string}
 */
const getResultAnnotation = (result) => {

	// Check for non-void result
	if (result) {

		const { annotation, classification } = getTypeGuardMeta(result);

		// Check for optional type
		if (classification === 'optional') {
			throw TypeError('Optional type cannot be a function return');
		}

		return annotation;
	}

	return 'void';
};

/**
 * Get function annotation
 * @template {Tuple} A
 * @template {TypeGuard<any>} R
 * @param {A} args
 * @param {NotOptionalTypeGuard<R>} [result]
 */
const getFunctionAnnotation = (args, result) => {

	return `${getArgumentsAnnotation(args)} => ${getResultAnnotation(result)}`;
};

/**
 * Check for function values
 * @template {Tuple} A
 * @template {TypeGuard<any>} R
 * @param {A} args
 * @param {NotOptionalTypeGuard<R>} [result]
 * @returns {TypeGuard<InferFunction<A, R>>}
 */
const isFunction = (args, result) => {

	const isArgsTuple = isTupleOf(args);
	const annotation = getFunctionAnnotation(args, result);

	/** @type {TypeGuard<InferFunction<A, R>>} */
	const check = (value) => {

		// Check for function values
		if (typeof value === 'function') {
			return true;
		}

		return false;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		args: isArgsTuple,
		classification: 'function',
		description: `a function ${annotation}`,
		result
	});

	return check;
};

module.exports = {
	isFunction
};