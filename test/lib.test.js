'use strict';

const { test, ok } = require('tap');
const lib = require('r-assign/lib');

const libKeys = Object.keys(lib);

const methods = [
	'any',
	'anyDate',
	'anyNumber',
	'array',
	'asAnyDate',
	'asDate',
	'asString',
	'bigint',
	'boolean',
	'convertToAnyDate',
	'convertToDate',
	'convertToString',
	'date',
	'func',
	'getAny',
	'getAnyNumber',
	'getArrayOf',
	'getBigInt',
	'getBoolean',
	'getInstanceOf',
	'getIntersectionOf',
	'getLiteral',
	'getLiteralOf',
	'getNull',
	'getNullable',
	'getNumber',
	'getObjectOf',
	'getOptional',
	'getStrictObjectOf',
	'getString',
	'getSymbol',
	'getTupleOf',
	'getType',
	'getUnionOf',
	'instance',
	'intersection',
	'isAny',
	'isAnyDate',
	'isAnyNumber',
	'isArrayOf',
	'isBigInt',
	'isBoolean',
	'isDate',
	'isFunction',
	'isInstanceOf',
	'isIntersectionOf',
	'isLiteral',
	'isLiteralOf',
	'isNull',
	'isNullable',
	'isNullish',
	'isNumber',
	'isObjectOf',
	'isOptional',
	'isOptionalUndefined',
	'isPartial',
	'isPartialUndefined',
	'isRecordOf',
	'isRequired',
	'isStrictObjectOf',
	'isString',
	'isSymbol',
	'isTemplateLiteralOf',
	'isTupleOf',
	'isUndefined',
	'isUnionOf',
	'literal',
	'literals',
	'nullable',
	'nulled',
	'nullish',
	'number',
	'object',
	'optional',
	'optionalUndef',
	'parseAny',
	'parseAnyNumber',
	'parseArrayOf',
	'parseBigInt',
	'parseBoolean',
	'parseInstanceOf',
	'parseIntersectionOf',
	'parseLiteral',
	'parseLiteralOf',
	'parseNull',
	'parseNullable',
	'parseNumber',
	'parseObjectOf',
	'parseOptional',
	'parseStrictObjectOf',
	'parseString',
	'parseSymbol',
	'parseTupleOf',
	'parseType',
	'parseUnionOf',
	'partial',
	'partialUndef',
	'record',
	'required',
	'strictObject',
	'string',
	'symbol',
	'templateLiteral',
	'tuple',
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