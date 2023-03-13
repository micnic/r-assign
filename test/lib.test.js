import { test, ok } from 'tap';
import * as lib from 'r-assign';

const libKeys = Object.keys(lib);

const methods = [
	'any',
	'array',
	'asBigInt',
	'asBoolean',
	'asNumber',
	'asDate',
	'asString',
	'assertType',
	'asyncFunc',
	'bigint',
	'boolean',
	'date',
	'default',
	'func',
	'getType',
	'instance',
	'intersection',
	'isAny',
	'isArrayOf',
	'isAsyncFunction',
	'isBigInt',
	'isBoolean',
	'isDate',
	'isFunction',
	'isInstanceOf',
	'isIntersectionOf',
	'isKeyOf',
	'isLiteral',
	'isLiteralOf',
	'isNever',
	'isNull',
	'isNullable',
	'isNullish',
	'isNumber',
	'isObjectOf',
	'isOmitFrom',
	'isOptional',
	'isOptionalUndefined',
	'isPartial',
	'isPartialUndefined',
	'isPickFrom',
	'isPromiseOf',
	'isRecordOf',
	'isRequired',
	'isString',
	'isSymbol',
	'isTemplateLiteralOf',
	'isTupleOf',
	'isTupleRestOf',
	'isUndefined',
	'isUnionOf',
	'keyof',
	'literal',
	'literals',
	'never',
	'nullable',
	'nulled',
	'nullish',
	'number',
	'object',
	'optional',
	'optionalUndef',
	'omit',
	'parseType',
	'partial',
	'partialUndef',
	'pick',
	'promise',
	'record',
	'required',
	'same',
	'setSame',
	'setStrict',
	'strict',
	'string',
	'symbol',
	'templateLiteral',
	'tuple',
	'tupleRest',
	'undef',
	'union'
];

test('rAssign lib exports', ({ end }) => {

	methods.forEach((method) => {
		ok(method in lib, `Checked key "${method}" is exported`);
	});

	libKeys.forEach((key) => {
		ok(methods.includes(key), `Exported key "${key}" is checked`);
	});

	end();
});