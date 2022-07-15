'use strict';

const onlyForObjectOrTuple = 'can only be applied to object or tuple type';

module.exports = {
	invalidConstructor: 'Invalid constructor provided',
	invalidDate: 'Invalid date value',
	invalidLiteral: 'Invalid literal provided',
	invalidLiterals: 'Invalid literals provided',
	invalidOptional: 'Optional type cannot be wrapped in optional type',
	invalidPartial: `Partial type ${onlyForObjectOrTuple}`,
	invalidRequired: `Required type ${onlyForObjectOrTuple}`,
	invalidShape: 'Invalid shape provided',
	invalidTemplateLiteral: 'Invalid template literal provided'
};