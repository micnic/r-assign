'use strict';

const Benchmark = require('benchmark');

const { isArrayOf, isObjectOf, isString, parseType } = require('r-assign/lib');
const zod = require('zod');

new Promise((resolve, reject) => {
	const parseString = parseType(isString);
	const zodString = zod.string();

	new Benchmark.Suite().add('rAssign parse string', () => {
		parseType(isString)('data');
	}).add('rAssign cached parse string', () => {
		parseString('data');
	}).add('zod parse string', () => {
		zod.string().parse('data');
	}).add('zod cached parse string', () => {
		zodString.parse('data');
	}).on('cycle', (event) => {
		console.log(String(event.target));
	}).on('complete', () => {
		console.log('-----');
		resolve();
	}).on('error', (error) => {
		reject(error);
	}).run({ async: true });
}).then(() => new Promise((resolve, reject) => {
	const parseStringArray = parseType(isArrayOf(isString));
	const zodStringArray = zod.array(zod.string());

	new Benchmark.Suite().add('rAssign parse string array', () => {
		parseType(isArrayOf(isString))(['data']);
	}).add('rAssign cached parse string array', () => {
		parseStringArray(['data']);
	}).add('zod parse string array', () => {
		zod.array(zod.string()).parse(['data']);
	}).add('zod cached parse string array', () => {
		zodStringArray.parse(['data']);
	}).on('cycle', (event) => {
		console.log(String(event.target));
	}).on('complete', () => {
		console.log('-----');
		resolve();
	}).on('error', (error) => {
		reject(error);
	}).run({ async: true });
})).then(() => new Promise((resolve, reject) => {
	const parseObjectData = parseType(isObjectOf({ data: isString }));
	const zodObjectData = zod.object({ data: zod.string() });

	new Benchmark.Suite().add('rAssign parse object', () => {
		parseType(isObjectOf({ data: isString }))({ data: 'data' });
	}).add('rAssign cached parse object', () => {
		parseObjectData({ data: 'data' });
	}).add('zod parse object', () => {
		zod.object({ data: zod.string() }).parse({ data: 'data' });
	}).add('zod cached parse object', () => {
		zodObjectData.parse({ data: 'data' });
	}).on('cycle', (event) => {
		console.log(String(event.target));
	}).on('complete', () => {
		console.log('-----');
		resolve();
	}).on('error', (error) => {
		reject(error);
	}).run({ async: true });
}));