'use strict';

const arrayOrObject = 'object, record, array or tuple types';
const elementCantFollow = 'element cannot follow a';
const objectOrTuple = 'object or tuple types';
const typeOnlyFor = 'type can only be applied to';

module.exports = {
	invalidConstructor: 'Invalid constructor provided',
	invalidDate: 'Invalid date value',
	invalidLiteral: 'Invalid literal provided',
	invalidLiterals: 'Invalid literals provided',
	invalidOptional: 'Optional type cannot be wrapped in optional type',
	invalidPartial: `Partial ${typeOnlyFor} ${arrayOrObject}`,
	invalidRequired: `Required ${typeOnlyFor} ${objectOrTuple}`,
	invalidShape: 'Invalid shape provided',
	invalidTemplateLiteral: 'Invalid template literal provided',
	optionalAfterRest: `An optional ${elementCantFollow} rest element`,
	requiredAfterOptional: `A required ${elementCantFollow}n optional element`,
	restAfterRest: `A rest ${elementCantFollow}nother rest element`
};