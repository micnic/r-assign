/**
 * @typedef {import('r-assign').Literal} Literal
 */

/**
 * @typedef {import('r-assign').Shape} Shape
 */

/**
 * @typedef {import('r-assign').Tuple} Tuple
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').OTG<T>} OptionalTypeGuard
 */

/**
 * @template {Literal} L
 * @typedef {import('./index.js').STL<L>} StringifiedTemplateLiteral
 */

/**
 * @typedef {import('./index.js').TC} TypeClassification
 */

/**
 * @typedef {import('./index.js').TGM} TypeGuardMeta
 */

/**
 * @typedef {import('./index.js').OPTGM} OptionalTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').OTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').PTGM} PrimitiveTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').RTGM} RecordTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').VTGM} VoidTypeGuardMeta
 */

const invalidTypeGuard = 'Invalid type guard provided';

/**
 * @type {WeakMap<TypeGuard, TypeGuardMeta>}
 */
const typeGuardMeta = new WeakMap();

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
* Get input annotation
* @param {TypeGuardMeta} meta
* @returns {string}
*/
const getInputAnnotation = (meta) => {

	// Switch on input classification
	switch (meta.classification) {

		case 'array': {
			return `...args: ${getTypeAnnotation(meta)}`;
		}

		case 'tuple': {

			// Check for empty tuple
			if (meta.tuple.length === 0) {
				return '';
			}

			const { required, rest } = meta.indexes;

			// Check for required arguments after rest
			if (rest >= 0 && required > rest) {
				return `...args: ${getTypeAnnotation(meta)}`;
			}

			return meta.tuple.map((type, index) => {

				const child = getTypeGuardMeta(type);

				// Check for optional type
				if (child.classification === 'optional') {
					return `arg_${index}?: ${getTypeAnnotation(child)}`;
				}

				return `arg_${index}: ${getTypeAnnotation(child)}`;
			}).join(', ');
		}

		/* c8 ignore next 4 */
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

	return getTypeAnnotation(meta);
};

/**
 * Get function annotation
 * @param {TypeGuardMeta} inputMeta
 * @param {TypeGuardMeta} outputMeta
 * @returns {string}
 */
const getFunctionAnnotation = (inputMeta, outputMeta) =>
	`(${getInputAnnotation(inputMeta)}) => ${getOutputAnnotation(outputMeta)}`;

/**
 * Get literal annotation
 * @template {Literal} L
 * @param {L} literal
 * @returns {string}
 */
const getLiteralAnnotation = (literal) => {

	// Switch on literal type
	switch (typeof literal) {

		case 'bigint': {
			return `${literal}n`;
		}

		case 'string': {
			return `"${literal}"`;
		}

		default: {
			return String(literal);
		}
	}
};

/**
 * Get literals annotation
 * @template {Literal} L
 * @param {L[]} literals
 * @returns {string}
 */
const getLiteralsAnnotation = (literals) =>
	literals.map(getLiteralAnnotation).join(' | ');

/**
 * Get object annotation from the provided shape
 * @param {ObjectTypeGuardMeta} meta
 * @returns {string}
 */
const getObjectAnnotation = (meta) => {

	// Check for empty shape
	if (meta.all.size === 0) {
		return '{}';
	}

	return `{\n${[...meta.all]
		.map(([key, child]) => {

			// Check for optional type guard
			if (child.classification === 'optional') {
				return ` "${key}"?: ${getTypeAnnotation(child)};\n`;
			}

			return ` "${key}": ${getTypeAnnotation(child)};\n`;
		})
		.join('')}}`;
};

/**
 * Get object description from the provided annotation and strict flag
 * @param {string} annotation
 * @param {boolean} strict
 */
const getObjectDescription = (annotation, strict) => {

	// Check for strict object
	if (strict) {
		return `an object of strict shape ${annotation}`;
	}

	return `an object of shape ${annotation}`;
};

/**
 * Get optional annotation
 * @param {OptionalTypeGuardMeta} meta
 * @returns {string}
 */
const getOptionalAnnotation = (meta) => {

	// Check for undefined optional
	if (meta.undef) {
		return `(${getTypeAnnotation(meta.child)} | undefined)`;
	}

	return getTypeAnnotation(meta.child);
};

/**
 * Get primitive description from the provided primitive
 * @param {PrimitiveTypeGuardMeta['primitive']} primitive
 * @returns {string}
 */
const getPrimitiveDescription = (primitive) => {

	switch (primitive) {

		case 'bigint': {
			return 'a BigInt value';
		}

		default: {
			return `a ${primitive} value`;
		}
	}
};

/**
 * Get record annotation based on keys and values type guards
 * @param {TypeGuardMeta} keys
 * @param {TypeGuardMeta} values
 * @param {ObjectTypeGuardMeta} [object]
 * @returns {string}
 */
const getRecordAnnotation = (keys, values, object) => {

	if (object) {
		return `{\n[x: ${getTypeAnnotation(keys)}]: ${getTypeAnnotation(
			values
		)}; ${getObjectAnnotation(object).slice(2, 1)}}}`;
	}

	return `Record<${getTypeAnnotation(keys)}, ${getTypeAnnotation(values)}>`;
};

/**
 * Get template literal annotation
 * @template {Literal} L
 * @param {StringifiedTemplateLiteral<L>} template
 * @returns {string}
 */
const getTemplateLiteralAnnotation = (template) =>
	`\`${template
		.map((type) => {
			// Check for type guard
			if (typeof type === 'function') {
				return `\${${getTypeAnnotation(getTypeGuardMeta(type))}}`;
			}

			return type;
		})
		.join('')}\``;

/**
 * Get tuple annotation
 * @param {Tuple} tuple
 * @returns {string}
 */
const getTupleAnnotation = (tuple) => `[ ${tuple.map((type) => {

	const meta = getTypeGuardMeta(type);

	switch (meta.classification) {
		case 'optional': {
			return `${getTypeAnnotation(meta)}?`;
		}

		default: {
			return getTypeAnnotation(meta);
		}
	}
}).join(', ')} ]`;

/**
 * Get type annotation from the provided type guard meta
 * @param {TypeGuardMeta} meta
 * @returns {string}
 */
export const getTypeAnnotation = (meta) => {

	switch (meta.classification) {

		case 'array': {
			return `${getTypeAnnotation(meta.child)}[]`;
		}

		case 'function': {
			return getFunctionAnnotation(...meta.children);
		}

		case 'instance': {
			return meta.builder.name;
		}

		case 'intersection': {
			return `(${meta.children.map(getTypeAnnotation).join(' & ')})`;
		}

		case 'literal': {
			return getLiteralAnnotation(meta.literal);
		}

		case 'literals': {
			return getLiteralsAnnotation(meta.literals);
		}

		case 'object': {
			return getObjectAnnotation(meta);
		}

		case 'optional': {
			return getOptionalAnnotation(meta);
		}

		case 'primitive': {
			return meta.primitive;
		}

		case 'promise': {
			return `Promise<${getTypeAnnotation(meta.child)}>`;
		}

		case 'record': {
			return getRecordAnnotation(...meta.children);
		}

		case 'rest': {
			return `...${getTypeAnnotation(meta.child)}[]`;
		}

		case 'template-literal': {
			return getTemplateLiteralAnnotation(meta.template);
		}

		case 'tuple': {
			return getTupleAnnotation(meta.tuple);
		}

		case 'union': {
			return `(${meta.children.map(getTypeAnnotation).join(' | ')})`;
		}

		default: {
			return meta.classification;
		}
	}
};

/**
 * Get type description from the provided type guard meta
 * @param {TypeGuardMeta} meta
 * @returns {string}
 */
export const getTypeDescription = (meta) => {

	switch (meta.classification) {

		case 'array': {
			return getArrayDescription(
				getTypeAnnotation(meta.child),
				meta.child.classification
			);
		}

		case 'function': {
			return `a function ${getTypeAnnotation(meta)}`;
		}

		case 'instance': {
			return `an instance of ${meta.builder.name}`;
		}

		case 'intersection': {
			return `an intersection of ${getTypeAnnotation(meta)}`;
		}

		case 'literal': {
			return `${getTypeAnnotation(meta)} literal`;
		}

		case 'literals': {
			return `a union of literals ${getTypeAnnotation(meta)}`;
		}

		case 'object': {
			return getObjectDescription(getTypeAnnotation(meta), meta.strict);
		}

		case 'primitive': {
			return getPrimitiveDescription(meta.primitive);
		}

		case 'promise': {
			return `a promise of ${getTypeAnnotation(meta.child)}`;
		}

		case 'record': {
			return `a record of ${getTypeAnnotation(meta)}`;
		}

		case 'template-literal': {
			return `a template literal of ${getTypeAnnotation(meta)}`;
		}

		case 'tuple': {
			return `a tuple of ${getTypeAnnotation(meta)}`;
		}

		case 'union': {
			return `a union of ${getTypeAnnotation(meta)}`;
		}

		default: {
			return getTypeAnnotation(meta);
		}
	}
};

/**
 * Get type guard from the provided type guard meta
 * @param {TypeGuardMeta} meta
 * @returns {TypeGuard}
 */
export const getTypeGuard = (meta) => meta.check;

/**
 * Extract type guard meta
 * @param {TypeGuard} type
 * @returns {TypeGuardMeta}
 */
export const getTypeGuardMeta = (type) => {

	const meta = typeGuardMeta.get(type);

	// Validate type guard meta
	if (!meta) {
		throw TypeError(invalidTypeGuard);
	}

	return meta;
};

/**
 * Extract type guard meta that may be void
 * @param {TypeGuard | undefined} type
 * @returns {TypeGuardMeta}
 */
export const getVoidableTypeGuardMeta = (type) => {

	// Check for void type
	if (type === undefined) {

		/** @type {TypeGuard<void>} */
		const check = () => true;

		return {
			check,
			classification: 'void'
		};
	}

	return getTypeGuardMeta(type);
};

/**
 * Assert for base type guards
 * @param {TypeClassification} classification
 */
export const assertBaseTypeGuard = (classification) => {

	// Check for optional type
	if (classification === 'optional') {
		throw TypeError('Invalid use of optional type');
	}

	// Check for rest type
	if (classification === 'rest') {
		throw TypeError('Invalid use of tuple rest');
	}
};

/**
 * Check for key type guard
 * @param {TypeGuardMeta} meta
 * @returns {type is TypeGuard<keyof any>}
 */
export const isKeyType = (meta) => {

	// Switch on type classification
	switch (meta.classification) {

		case 'any':
		case 'literal':
		case 'literals':
		case 'template-literal': {
			return true;
		}

		case 'primitive': {
			return (
				meta.primitive === 'number' ||
				meta.primitive === 'string' ||
				meta.primitive === 'symbol'
			);
		}

		case 'union': {
			return meta.children.every(isKeyType);
		}

		default: {
			return false;
		}
	}
};

/**
 * Check for string type guard
 * @param {TypeGuard} type
 * @returns {type is TypeGuard<string>}
 */
export const isStringTypeGuard = (type) => {

	const meta = getTypeGuardMeta(type);

	return (meta.classification === 'primitive' && meta.primitive === 'string');
};

/**
 * Save type guard meta
 * @param {TypeGuard} type
 * @param {TypeGuardMeta} meta
 */
export const setTypeGuardMeta = (type, meta) => {
	typeGuardMeta.set(type, meta);
};