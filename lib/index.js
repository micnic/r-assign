'use strict';

const { isAny, useAny, validateAny } = require('r-assign/lib/any');
const { isBoolean, useBoolean } = require('r-assign/lib/boolean');
const { isNumber, useNumber } = require('r-assign/lib/number');
const { isString, useString } = require('r-assign/lib/string');
const {
	isTypeOf,
	useOptional,
	useTypeOf,
	useValidation
} = require('r-assign/lib/type');

module.exports = {
	isAny,
	isBoolean,
	isNumber,
	isString,
	isTypeOf,
	useAny,
	useBoolean,
	useNumber,
	useOptional,
	useString,
	useTypeOf,
	useValidation,
	validateAny
};