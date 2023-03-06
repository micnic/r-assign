const arrayOrObject = 'object, record, array or tuple types';
const elementCantFollow = 'element cannot follow a';
const objectOrTuple = 'object or tuple types';
const typeOnlyFor = 'type can only be applied to';

const invalidConstructor = 'Invalid constructor provided';
const invalidDate = 'Invalid date value';
const invalidLiteral = 'Invalid literal provided';
const invalidLiterals = 'Invalid literals provided';
const invalidOptional = 'Optional type cannot be wrapped in optional type';
const invalidPartial = `Partial ${typeOnlyFor} ${arrayOrObject}`;
const invalidRequired = `Required ${typeOnlyFor} ${objectOrTuple}`;
const invalidShape = 'Invalid shape provided';
const invalidTemplateLiteral = 'Invalid template literal provided';
const optionalAfterRest = `An optional ${elementCantFollow} rest element`;
const requiredAfterOptional = `A required ${
	elementCantFollow
}n optional element`;
const restAfterRest = `A rest ${elementCantFollow}nother rest element`;

export {
	invalidConstructor,
	invalidDate,
	invalidLiteral,
	invalidLiterals,
	invalidOptional,
	invalidPartial,
	invalidRequired,
	invalidShape,
	invalidTemplateLiteral,
	optionalAfterRest,
	requiredAfterOptional,
	restAfterRest
};