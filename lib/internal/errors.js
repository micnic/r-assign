'use strict';

const arrayOrObject = 'object, record, array or tuple types';
const objectOrTuple = 'object or tuple types';
const onlyFor = 'can only be applied to';

module.exports = {
	invalidConstructor: 'Invalid constructor provided',
	invalidDate: 'Invalid date value',
	invalidLiteral: 'Invalid literal provided',
	invalidLiterals: 'Invalid literals provided',
	invalidOptional: 'Optional type cannot be wrapped in optional type',
	invalidPartial: `Partial type ${onlyFor} ${arrayOrObject}`,
	invalidRequired: `Required type ${onlyFor} ${objectOrTuple}`,
	invalidShape: 'Invalid shape provided',
	invalidTemplateLiteral: 'Invalid template literal provided'
};