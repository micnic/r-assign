'use strict';

const { isAny, useAny, validateAny } = require('r-assign/lib/any');
const { isBigInt, useBigInt, validateBigInt } = require('r-assign/lib/bigint');
const {
	isBoolean,
	useBoolean,
	validateBoolean
} = require('r-assign/lib/boolean');
const { isNumber, useNumber, validateNumber } = require('r-assign/lib/number');
const { isString, useString, validateString } = require('r-assign/lib/string');
const {
	isTypeOf,
	useOptional,
	useTypeOf,
	useValidation
} = require('r-assign/lib/type');

module.exports = {
	isAny,
	isBigInt,
	isBoolean,
	isNumber,
	isString,
	isTypeOf,
	useAny,
	useBigInt,
	useBoolean,
	useNumber,
	useOptional,
	useString,
	useTypeOf,
	useValidation,
	validateAny,
	validateBigInt,
	validateBoolean,
	validateNumber,
	validateString
};