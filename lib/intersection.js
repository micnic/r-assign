'use strict';

const {
	hasAtLeastTwoElements,
	hasOneElement
} = require('r-assign/lib/internal/array-checks');
const { getTypeREX } = require('r-assign/lib/internal/get-type-rex');
const { forEvery, forIn } = require('r-assign/lib/internal/object-utils');
const {
	invalidInitialValue,
	invalidOptionalType,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { pickValue } = require('r-assign/lib/internal/pick-value');
const {
	getTypeGuardMeta,
	isStringTypeGuard
} = require('r-assign/lib/internal/type-guard-meta');
const { isArrayOf } = require('r-assign/lib/array');
const { isFunction } = require('r-assign/lib/function');
const { isLiteral, isLiteralOf } = require('r-assign/lib/literal');
const { isObjectOf } = require('r-assign/lib/object');
const { isOptional, isOptionalUndefined } = require('r-assign/lib/optional');
const { isRecordOf } = require('r-assign/lib/record');
const { isTemplateLiteralOf } = require('r-assign/lib/template-literal');
const { isTupleOf } = require('r-assign/lib/tuple');
const { isUnionOf } = require('r-assign/lib/union');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Intersection} Intersection
 */

/**
 * @template {Intersection} I
 * @typedef {import('r-assign/lib').InferIntersection<I>} InferIntersection
 */

/**
 * @typedef {import('r-assign/lib').Literal} Literal
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template {Literal} [T = any]
 * @typedef {import('r-assign/lib').TemplateLiteral<T>} TemplateLiteral
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @typedef {import('r-assign/lib').Union} Union
 */

/**
 * @typedef {import('r-assign/lib/internal').TGM} TypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').ArTGM} ArrayTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').FTGM} FunctionTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').LTGM} LiteralTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').LsTGM} LiteralsTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').ObTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').PTGM} PrimitiveTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').RTGM} RecordTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').TLTGM} TemplateLiteralTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').TTGM} TupleTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').UTGM} UnionTypeGuardMeta
 */

/**
 * @template {Literal} L
 * @typedef {import('r-assign/lib/internal').STL<L>} StringifiedTemplateLiteral
 */

const { isArray } = Array;

const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

const anyIntersection = () => {
	throw TypeError('Provided intersection of any, use any type guard instead');
};

const impossibleIntersection = () => {
	throw TypeError('Provided intersection is impossible');
};

const instanceIntersection = () => {
	throw TypeError('Instance type guards are not allowed in intersections');
};

const invalidOptional = () => {
	throw TypeError(invalidOptionalType('intersection'));
};

const mixingObjects = () => {
	throw TypeError('Mixing objects and other types in intersection');
};

const strictObjects = () => {
	throw TypeError(
		'Strict object type guards are not allowed in intersections'
	);
};

/**
 * Check for invalid type guards for intersection
 * @param {TypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 */
const validateMeta = (firstMeta, secondMeta) => {

	// Check for any type guard classification
	if (
		firstMeta.classification === 'any' ||
		secondMeta.classification === 'any'
	) {
		return anyIntersection();
	}

	// Check for instance type guard classification
	if (
		firstMeta.classification === 'instance' ||
		secondMeta.classification === 'instance'
	) {
		return instanceIntersection();
	}

	// Check for optional type guard classification
	if (
		firstMeta.classification === 'optional' ||
		secondMeta.classification === 'optional'
	) {
		return invalidOptional();
	}

	/* istanbul ignore next */
	return impossibleIntersection();
};

/**
 * Reduce provide object shapes
 * @param {Shape} firstShape
 * @param {Shape} secondShape
 * @returns {Shape}
 */
const reduceShapeIntersection = (firstShape, secondShape) => {

	/** @type {Shape} */
	const shape = {};

	// Loop through first shape
	forIn(firstShape, (firstType, key) => {

		const secondType = secondShape[key];

		// Check for second type
		if (secondType) {

			const firstMeta = getTypeGuardMeta(firstType);
			const secondMeta = getTypeGuardMeta(secondType);

			// Check for optional types
			if (
				firstMeta.classification === 'optional' &&
				secondMeta.classification === 'optional'
			) {
				if (firstMeta.undef && secondMeta.undef) {
					shape[key] = isOptionalUndefined(reduceIntersection([
						firstMeta.type,
						secondMeta.type
					]));
				} else {
					shape[key] = isOptional(reduceIntersection([
						firstMeta.type,
						secondMeta.type
					]));
				}
			} else if (firstMeta.classification === 'optional') {
				shape[key] = reduceIntersection([firstMeta.type, secondType]);
			} else if (secondMeta.classification === 'optional') {
				shape[key] = reduceIntersection([firstType, secondMeta.type]);
			} else {
				shape[key] = reduceIntersection([firstType, secondType]);
			}
		} else {
			shape[key] = firstType;
		}
	});

	// Loop through second shape
	forIn(secondShape, (secondType, key) => {
		if (!firstShape[key]) {
			shape[key] = secondType;
		}
	});

	return shape;
};

/**
 * Reduce provided template literals
 * @template {Literal} FL
 * @template {Literal} SL
 * @param {StringifiedTemplateLiteral<FL>} first
 * @param {StringifiedTemplateLiteral<SL>} second
 * @returns {StringifiedTemplateLiteral<Literal>}
 */
// eslint-disable-next-line complexity
const reduceTemplateLiterals = (first, second) => {

	const result = [];

	let fIndex = 0;
	let sIndex = 0;

	while (fIndex < first.length && sIndex < second.length) {

		const fPart = first[fIndex];
		const sPart = second[sIndex];

		if (typeof fPart === 'function') {
			if (typeof sPart === 'function') {
				const fMeta = getTypeGuardMeta(fPart);
				const sMeta = getTypeGuardMeta(sPart);

				if (isStringTypeGuard(fPart) && isStringTypeGuard(sPart)) {
					result.push(fPart);
				}
			}

			if (typeof sPart === 'string') {

			}
		}

		if (typeof fPart === 'string') {
			if (typeof sPart === 'function') {

			}

			if (typeof sPart === 'string') {
				if (fPart === sPart) {
					result.push(fPart);
				} else {

					const fPartIndex = sPart.indexOf(fPart);
					const sPartIndex = fPart.indexOf(sPart);

					if (fPartIndex === 0) {
						const fNextPart = first[fIndex + 1];

						if (
							typeof fNextPart === 'function' &&
							isStringTypeGuard(fNextPart)
						) {
							result.push(sPart);
						}
					} else if (fPartIndex > 0) {
						if (fPartIndex + fPart.length === sPart.length) {
							const fPrevPart = first[fIndex - 1];

							if (
								typeof fPrevPart === 'function' &&
								isStringTypeGuard(fPrevPart)
							) {
								result.push(sPart);
							}
						} else {
							const fNextPart = first[fIndex + 1];

							if (
								typeof fNextPart === 'function' &&
								isStringTypeGuard(fNextPart)
							) {
								result.push(sPart);
							} else {
								return impossibleIntersection();
							}
						}
					} else if (sPartIndex === 0) {
						const sNextPart = second[sIndex + 1];

						if (
							typeof sNextPart === 'function' &&
							isStringTypeGuard(sNextPart)
						) {
							result.push(fPart);
						}
					} else if (sPartIndex > 0) {
						if (sPartIndex + sPart.length === fPart.length) {
							const sPrevPart = second[sIndex - 1];

							if (
								typeof sPrevPart === 'function' &&
								isStringTypeGuard(sPrevPart)
							) {
								result.push(fPart);
							}
						} else {
							const sNextPart = second[sIndex + 1];

							if (
								typeof sNextPart === 'function' &&
								isStringTypeGuard(sNextPart)
							) {
								result.push(fPart);
							} else {
								return impossibleIntersection();
							}
						}
					} else {
						return impossibleIntersection();
					}
				}
			}
		}

		fIndex++;
		sIndex++;
	}

	return result;

	//return impossibleIntersection();
};

/**
 * Reduce provided tuples
 * @param {Tuple} firstTuple
 * @param {Tuple} secondTuple
 * @returns {Tuple}
 */
const reduceTuples = (firstTuple, secondTuple) => {

	// Check for incompatible tuples length
	if (firstTuple.length === secondTuple.length) {

		return firstTuple.map((firstType, index) => {

			const secondType = secondTuple[index];

			// Check for second type
			if (secondType) {
				const firstMeta = getTypeGuardMeta(firstType);
				const secondMeta = getTypeGuardMeta(secondType);

				// Check for optional types
				if (
					firstMeta.classification === 'optional' &&
					secondMeta.classification === 'optional'
				) {

					// Check for optional undefined types
					if (firstMeta.undef && secondMeta.undef) {
						return isOptionalUndefined(reduceIntersection([
							firstMeta.type,
							secondMeta.type
						]));
					}

					return isOptional(reduceIntersection([
						firstMeta.type,
						secondMeta.type
					]));
				}

				// Check for first type as optional
				if (firstMeta.classification === 'optional') {
					return reduceIntersection([firstMeta.type, secondType]);
				}

				// Check for second type as optional
				if (secondMeta.classification === 'optional') {
					return reduceIntersection([firstType, secondMeta.type]);
				}

				return reduceIntersection([firstType, secondType]);
			}

			/* istanbul ignore next */
			return impossibleIntersection();
		});
	}

	return impossibleIntersection();
};

/**
 * Intersect array and tuple types
 * @param {ArrayTypeGuardMeta} arrayMeta
 * @param {TupleTypeGuardMeta} tupleMeta
 * @returns {TypeGuard}
 */
const intersectArrayTuple = (arrayMeta, tupleMeta) => {
	return isTupleOf(tupleMeta.tuple.map((type) => {
		return reduceIntersection([arrayMeta.type, type]);
	}));
};

/**
 * Intersect literal and literals types
 * @param {LiteralTypeGuardMeta} literalMeta
 * @param {LiteralsTypeGuardMeta} literalsMeta
 * @returns {TypeGuard}
 */
const intersectLiteralLiterals = (literalMeta, literalsMeta) => {

	// Check if the provided literal is included in the provided literals
	if (literalsMeta.literals.includes(literalMeta.literal)) {
		return literalMeta.main;
	}

	return impossibleIntersection();
};

/**
 * Intersect literal and primitive types
 * @param {LiteralTypeGuardMeta} literalMeta
 * @param {PrimitiveTypeGuardMeta} primitiveMeta
 * @returns {TypeGuard}
 */
const intersectLiteralPrimitive = (literalMeta, primitiveMeta) => {

	// Check if the provided literal is of the provided primitive type
	if (typeof literalMeta.literal === primitiveMeta.primitive) {
		return literalMeta.main;
	}

	return impossibleIntersection();
};

/**
 * Intersect literal and template literal types
 * @param {LiteralTypeGuardMeta} literalMeta
 * @param {TemplateLiteralTypeGuardMeta} templateLiteralMeta
 * @returns {TypeGuard}
 */
const intersectLiteralTemplateLiteral = (literalMeta, templateLiteralMeta) => {

	// Check if the provided literal can be applied to the template literal
	if (
		typeof literalMeta.literal === 'string' &&
		templateLiteralMeta.regexp.test(literalMeta.literal)
	) {
		return literalMeta.main;
	}

	return impossibleIntersection();
};

/**
 * Reduce the provided literals union
 * @param {Literal[]} literals
 * @param {LiteralsTypeGuardMeta} literalsMeta
 * @returns {TypeGuard}
 */
const reduceLiterals = (literals, literalsMeta) => {

	// Check for at least one literal in the literals union
	if (hasOneElement(literals)) {
		return isLiteral(literals[0]);
	}

	// Check for the same literals union size as the provided literals meta
	if (literals.length === literalsMeta.literals.length) {
		return literalsMeta.main;
	}

	// Check for at least some literals to create a literal union type
	if (hasAtLeastTwoElements(literals)) {
		return isLiteralOf(literals);
	}

	return impossibleIntersection();
};

/**
 * Intersect literals and primitive types
 * @param {LiteralsTypeGuardMeta} literalsMeta
 * @param {PrimitiveTypeGuardMeta} primitiveMeta
 * @returns {TypeGuard}
 */
const intersectLiteralsPrimitive = (literalsMeta, primitiveMeta) => {

	const commonLiterals = literalsMeta.literals.filter((literal) => {
		return typeof literal === primitiveMeta.primitive;
	});

	return reduceLiterals(commonLiterals, literalsMeta);
};

/**
 * Intersect literals and template literal types
 * @param {LiteralsTypeGuardMeta} literalsMeta
 * @param {TemplateLiteralTypeGuardMeta} tlMeta
 * @returns {TypeGuard}
 */
const intersectLiteralsTemplateLiteral = (literalsMeta, tlMeta) => {

	const commonLiterals = literalsMeta.literals.filter((literal) => {
		return (typeof literal === 'string' && tlMeta.regexp.test(literal));
	});

	return reduceLiterals(commonLiterals, literalsMeta);
};

/**
 * Reduce intersection with array as the first type
 * @param {ArrayTypeGuardMeta} arrayMeta
 * @param {TypeGuardMeta} secondMeta
 * @returns {TypeGuard}
 */
const reduceArrayIntersection = (arrayMeta, secondMeta) => {

	// Check second meta to be an array
	if (secondMeta.classification === 'array') {
		return isArrayOf(reduceIntersection([arrayMeta.type, secondMeta.type]));
	}

	// Check second meta to be a tuple
	if (secondMeta.classification === 'tuple') {
		return intersectArrayTuple(arrayMeta, secondMeta);
	}

	return mixingObjects();
};

/**
 * Reduce function arguments tuples
 * @param {Tuple} firstTuple
 * @param {Tuple} secondTuple
 * @returns {Tuple}
 */
const reduceFunctionArguments = (firstTuple, secondTuple) => {

	// Select bigger tuple to iterate through it
	if (firstTuple.length >= secondTuple.length) {
		return firstTuple.map((type, index) => {

			const secondType = secondTuple[index];

			// Check for for available second type
			if (secondType) {
				return isUnionOf([
					type,
					secondType
				]);
			}

			return type;
		});
	}

	return secondTuple.map((type, index) => {

		const firstType = firstTuple[index];

		// Check for for available first type
		if (firstType) {
			return isUnionOf([
				type,
				firstType
			]);
		}

		return type;
	});
};

/**
 * Reduce intersection with function as the first type
 * @param {FunctionTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 * @returns {TypeGuard}
 */
const reduceFunctionIntersection = (firstMeta, secondMeta) => {

	// Check second meta to be a function
	if (secondMeta.classification === 'function') {

		const firstArgsMeta = getTypeGuardMeta(firstMeta.args);
		const secondArgsMeta = getTypeGuardMeta(secondMeta.args);

		// Check for tuple
		if (
			firstArgsMeta.classification === 'tuple' &&
			secondArgsMeta.classification === 'tuple'
		) {

			// Check for both results available
			if (firstMeta.result && secondMeta.result) {
				return isFunction(
					reduceFunctionArguments(
						firstArgsMeta.tuple,
						secondArgsMeta.tuple
					),
					reduceIntersection([firstMeta.result, secondMeta.result])
				);
			}

			// Check for first result available
			if (firstMeta.result && !secondMeta.result) {
				return isFunction(
					reduceFunctionArguments(
						firstArgsMeta.tuple,
						secondArgsMeta.tuple
					),
					firstMeta.result
				);
			}

			// Check for second result available
			if (!firstMeta.result && secondMeta.result) {
				return isFunction(
					reduceFunctionArguments(
						firstArgsMeta.tuple,
						secondArgsMeta.tuple
					),
					secondMeta.result
				);
			}

			return isFunction(
				reduceFunctionArguments(
					firstArgsMeta.tuple,
					secondArgsMeta.tuple
				)
			);
		}
	}

	return impossibleIntersection();
};

/**
 * Reduce intersection with literal as the first type
 * @param {LiteralTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 * @returns {TypeGuard}
 */
const reduceLiteralIntersection = (firstMeta, secondMeta) => {

	// Switch on second meta classification
	switch (secondMeta.classification) {

		case 'literal': {

			// Check for literals to be equal
			if (firstMeta.literal === secondMeta.literal) {
				return firstMeta.main;
			}

			return impossibleIntersection();
		}

		case 'literals': {
			return intersectLiteralLiterals(firstMeta, secondMeta);
		}

		case 'primitive': {
			return intersectLiteralPrimitive(firstMeta, secondMeta);
		}

		case 'template-literal': {
			return intersectLiteralTemplateLiteral(firstMeta, secondMeta);
		}

		default: {
			return impossibleIntersection();
		}
	}
};

/**
 * Reduce intersection with literals as the first type
 * @param {LiteralsTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 * @returns {TypeGuard}
 */
const reduceLiteralsIntersection = (firstMeta, secondMeta) => {

	// Switch on second meta classification
	switch (secondMeta.classification) {

		case 'literal': {
			return intersectLiteralLiterals(secondMeta, firstMeta);
		}

		case 'literals': {

			const commonLiterals = firstMeta.literals.filter((literal) => {
				return secondMeta.literals.includes(literal);
			});

			return reduceLiterals(commonLiterals, firstMeta);
		}

		case 'primitive': {
			return intersectLiteralsPrimitive(firstMeta, secondMeta);
		}

		case 'template-literal': {
			return intersectLiteralsTemplateLiteral(firstMeta, secondMeta);
		}

		default: {
			return impossibleIntersection();
		}
	}
};

/**
 * Reduce intersection with object as the first type
 * @param {ObjectTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 */
const reduceObjectIntersection = (firstMeta, secondMeta) => {

	// Check second meta to be a record
	if (secondMeta.classification === 'record') {
		if (
			forEvery(
				firstMeta.shape,
				(value, key) => secondMeta.keys(key) && secondMeta.values(value)
			)
		) {
			return firstMeta.main;
		}
	}

	// Check second meta to be an object
	if (secondMeta.classification === 'object') {

		// Check for strict objects
		if (firstMeta.strict || secondMeta.strict) {
			return strictObjects();
		}

		return isObjectOf(
			reduceShapeIntersection(firstMeta.shape, secondMeta.shape)
		);
	}

	return impossibleIntersection();
};

/**
 * Reduce intersection with primitive as the first type
 * @param {PrimitiveTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 */
const reducePrimitiveIntersection = (firstMeta, secondMeta) => {

	// Switch on second meta classification
	switch (secondMeta.classification) {

		case 'literal': {
			return intersectLiteralPrimitive(secondMeta, firstMeta);
		}

		case 'literals': {
			return intersectLiteralsPrimitive(secondMeta, firstMeta);
		}

		case 'primitive': {

			// Check for primitives to be equal
			if (firstMeta.primitive === secondMeta.primitive) {
				return firstMeta.main;
			}

			return impossibleIntersection();
		}

		case 'template-literal': {

			// Check primitive to be string type
			if (firstMeta.primitive === 'string') {
				return secondMeta.main;
			}

			return impossibleIntersection();
		}

		default: {
			return impossibleIntersection();
		}
	}
};

/**
 * Reduce intersection with record as the first type
 * @param {RecordTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 */
const reduceRecordIntersection = (firstMeta, secondMeta) => {

	// Check second meta to be a record
	if (secondMeta.classification === 'record') {
		return isRecordOf(
			isUnionOf([
				firstMeta.keys,
				secondMeta.keys
			]),
			reduceIntersection([
				firstMeta.values,
				secondMeta.values
			])
		);
	}

	// Check second meta to be an object
	if (secondMeta.classification === 'object') {

		// Check for strict object
		if (secondMeta.strict) {
			return strictObjects();
		}

		// Check for object to be compatible
		if (
			forEvery(
				secondMeta.shape,
				(value, key) => firstMeta.keys(key) && firstMeta.values(value)
			)
		) {
			return secondMeta.main;
		}
	}

	return impossibleIntersection();
};

/**
 * Reduce intersection with template literal as the first type
 * @param {TemplateLiteralTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 * @returns {TypeGuard}
 */
const reduceTemplateLiteralIntersection = (firstMeta, secondMeta) => {

	// Switch on second meta classification
	switch (secondMeta.classification) {

		case 'literal': {
			return intersectLiteralTemplateLiteral(secondMeta, firstMeta);
		}

		case 'literals': {
			return intersectLiteralsTemplateLiteral(secondMeta, firstMeta);
		}

		case 'primitive': {

			// Check for primitive to be string type
			if (secondMeta.primitive === 'string') {
				return firstMeta.main;
			}

			return impossibleIntersection();
		}

		case 'template-literal': {
			return isTemplateLiteralOf(
				reduceTemplateLiterals(firstMeta.template, secondMeta.template)
			);
		}

		default: {
			return impossibleIntersection();
		}
	}
};

/**
 * Reduce intersection with tuple as the first type
 * @param {TupleTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 * @returns {TypeGuard}
 */
const reduceTupleIntersection = (firstMeta, secondMeta) => {

	// Check second meta to be an array
	if (secondMeta.classification === 'array') {
		return intersectArrayTuple(secondMeta, firstMeta);
	}

	// Check second meta to be a tuple
	if (secondMeta.classification === 'tuple') {
		return isTupleOf(
			reduceTuples(firstMeta.tuple, secondMeta.tuple)
		);
	}

	return mixingObjects();
};

/**
 * Reduce intersection with union as the first type
 * @param {UnionTypeGuardMeta} firstMeta
 * @param {TypeGuardMeta} secondMeta
 */
const reduceUnionIntersection = (firstMeta, secondMeta) => {

	if (secondMeta.classification === 'array') {
		// TBD
	}

	if (secondMeta.classification === 'function') {
		// TBD
	}

	if (secondMeta.classification === 'literal') {
		if (firstMeta.union.some((type) => {
			const meta = getTypeGuardMeta(type);

			// Switch on meta classification
			switch (meta.classification) {

				case 'literal': {
					return (meta.literal === secondMeta.literal);
				}

				case 'literals': {
					return meta.literals.includes(secondMeta.literal);
				}

				case 'primitive': {
					return (meta.primitive === typeof secondMeta.literal);
				}

				case 'template-literal': {
					return (
						typeof secondMeta.literal === 'string' &&
						meta.regexp.test(secondMeta.literal)
					);
				}

				default: {
					return false;
				}
			}
		})) {
			return secondMeta.main;
		}
	}

	if (secondMeta.classification === 'literals') {
		const commonTypes = firstMeta.union.flatMap((type) => {
			const meta = getTypeGuardMeta(type);

			switch (meta.classification) {

				case 'literal': {
					if (secondMeta.literals.includes(meta.literal)) {
						return meta.main;
					}

					return [];
				}

				case 'literals': {

					const commonLiterals = meta.literals.filter(
						(literal) => {
							return secondMeta.literals.includes(literal);
						}
					);

					if (hasOneElement(commonLiterals)) {
						return isLiteral(commonLiterals[0]);
					}

					if (commonLiterals.length === meta.literals.length) {
						return secondMeta.main;
					}

					if (hasAtLeastTwoElements(commonLiterals)) {
						return isLiteralOf(commonLiterals);
					}

					return [];
				}

				case 'primitive': {
					const commonLiterals = secondMeta.literals.filter(
						(literal) => {
							return typeof literal === meta.primitive;
						}
					);

					if (hasOneElement(commonLiterals)) {
						return isLiteral(commonLiterals[0]);
					}

					if (commonLiterals.length === secondMeta.literals.length) {
						return secondMeta.main;
					}

					if (hasAtLeastTwoElements(commonLiterals)) {
						return isLiteralOf(commonLiterals);
					}

					return [];
				}

				case 'template-literal': {
					const commonLiterals = secondMeta.literals.filter(
						(literal) => {
							return (
								typeof literal === 'string' &&
								meta.regexp.test(literal)
							);
						}
					);

					if (hasOneElement(commonLiterals)) {
						return isLiteral(commonLiterals[0]);
					}

					if (commonLiterals.length === secondMeta.literals.length) {
						return secondMeta.main;
					}

					if (hasAtLeastTwoElements(commonLiterals)) {
						return isLiteralOf(commonLiterals);
					}

					return [];
				}

				default: {
					return [];
				}
			}
		});

		if (hasOneElement(commonTypes)) {
			return commonTypes[0];
		}

		if (hasAtLeastTwoElements(commonTypes)) {
			return isUnionOf(commonTypes);
		}
	}

	if (secondMeta.classification === 'object') {

		if (secondMeta.strict) {
			return strictObjects();
		}

		// TBD
	}

	if (secondMeta.classification === 'primitive') {
		// TBD
	}

	if (secondMeta.classification === 'record') {
		// TBD
	}

	if (secondMeta.classification === 'template-literal') {
		// TBD
	}

	if (secondMeta.classification === 'tuple') {
		// TBD
	}

	if (secondMeta.classification === 'union') {
		// TBD
	}

	return impossibleIntersection();
};

/**
 * Reduce intersection
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {TypeGuard<InferIntersection<I>>}
 */
const reduceIntersection = (intersection) => {

	return intersection.reduce((first, second) => {

		const firstMeta = getTypeGuardMeta(first);
		const secondMeta = getTypeGuardMeta(second);

		// Switch on first type classification
		switch (firstMeta.classification) {

			case 'array': {
				return reduceArrayIntersection(firstMeta, secondMeta);
			}

			case 'function': {
				return reduceFunctionIntersection(firstMeta, secondMeta);
			}

			case 'literal': {
				return reduceLiteralIntersection(firstMeta, secondMeta);
			}

			case 'literals': {
				return reduceLiteralsIntersection(firstMeta, secondMeta);
			}

			case 'object': {
				return reduceObjectIntersection(firstMeta, secondMeta);
			}

			case 'primitive': {
				return reducePrimitiveIntersection(firstMeta, secondMeta);
			}

			case 'record': {
				return reduceRecordIntersection(firstMeta, secondMeta);
			}

			case 'template-literal': {
				return reduceTemplateLiteralIntersection(firstMeta, secondMeta);
			}

			case 'tuple': {
				return reduceTupleIntersection(firstMeta, secondMeta);
			}

			case 'union': {
				return reduceUnionIntersection(firstMeta, secondMeta);
			}

			default: {
				return validateMeta(firstMeta, secondMeta);
			}
		}
	});
};

/**
 * Check for intersection type values
 * @note Does not accept `isAny` type guard as it is redundant
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {TypeGuard<InferIntersection<I>>}
 */
const isIntersectionOf = (intersection) => {

	// Check for valid types provided
	if (!isArray(intersection)) {
		throw TypeError(invalidTypeGuards);
	}

	// Check for less than two type guards
	if (!hasAtLeastTwoElements(intersection)) {
		throw TypeError(notEnoughTypeGuards);
	}

	return reduceIntersection(intersection);
};

/**
 * Extract intersection type values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Intersection} I
 * @param {I} intersection
 * @param {InferIntersection<I>} initial
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const getIntersectionOf = (intersection, initial) => {

	const check = isIntersectionOf(intersection);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickValue(value, check);
		}

		return pickValue(initial, check);
	};
};

/**
 * Extract and validate intersection type values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const parseIntersectionOf = (intersection) => {

	const check = isIntersectionOf(intersection);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return pickValue(value, check);
	};
};

module.exports = {
	getIntersectionOf,
	intersection: isIntersectionOf,
	isIntersectionOf,
	parseIntersectionOf
};