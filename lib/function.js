'use strict';

const {
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
 * @typedef {import('r-assign/lib').NOTG<T>} NotOptionalTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @template {Tuple} A
 * @template {TypeGuard} R
 * @typedef {import('r-assign/lib').InferF<A, R>} InferFunction
 */

const invalidOptionalTypeReturn = 'Optional type cannot be a function return';

/**
 * Get arguments annotation
 * @param {Tuple} args
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
 * @template {TypeGuard} R
 * @param {NotOptionalTypeGuard<R>} [result]
 * @returns {string}
 */
const getResultAnnotation = (result) => {

	// Check for non-void result
	if (result) {

		const { annotation, classification } = getTypeGuardMeta(result);

		// Check for optional type
		if (classification === 'optional') {
			throw TypeError(invalidOptionalTypeReturn);
		}

		return annotation;
	}

	return 'void';
};

/**
 * Get function annotation
 * @template {Tuple} A
 * @template {TypeGuard} R
 * @param {A} args
 * @param {NotOptionalTypeGuard<R>} [result]
 * @returns {string}
 */
const getFunctionAnnotation = (args, result) => {

	return `${getArgumentsAnnotation(args)} => ${getResultAnnotation(result)}`;
};

/**
 * Check for function values
 * @template {Tuple} A
 * @template {TypeGuard} R
 * @param {A} args
 * @param {NotOptionalTypeGuard<R>} [result]
 * @returns {TypeGuard<InferFunction<A, R>>}
 */
const isFunction = (args, result) => {

	const isArgsTuple = isTupleOf(args);
	const annotation = getFunctionAnnotation(args, result);

	/** @type {TypeGuard<InferFunction<A, R>>} */
	const check = (value) => (typeof value === 'function');

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
	func: isFunction,
	isFunction
};