'use strict';

const Benchmark = require('benchmark');

const {
	isBoolean,
	isNumber,
	isString,
	parseArrayOf,
	parseObjectOf,
	parseString
} = require('r-assign/lib');
const zod = require('zod');

const suite = new Benchmark.Suite;

const zString = zod.string();
const zArrayString = zod.array(zString);
const zObjectABC = zod.object({
	a: zod.boolean(),
	b: zod.number(),
	c: zod.string()
});

const rParseArrayString = parseArrayOf(isString);
const rParseObjectABC = parseObjectOf({
	a: isBoolean,
	b: isNumber,
	c: isString
});

const stringArray = ['a', 'b', 'c', 'd', 'e'];

const objectABC = {
	a: true,
	b: 1,
	c: 'data'
};

suite.add('r-assign string parse', () => {
	parseString('data');
}).add('zod string parse', () => {
	zString.parse('data');
}).add('r-assign string array parse', () => {
	rParseArrayString(stringArray);
}).add('zod string array parse', () => {
	zArrayString.parse(stringArray);
}).add('r-assign object parse', () => {
	rParseObjectABC(objectABC);
}).add('zod object parse', () => {
	zObjectABC.parse(objectABC);
}).on('cycle', (event) => {
	console.log(String(event.target));
}).run({ async: true });