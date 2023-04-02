import {
	any,
	array,
	asBigInt,
	asBoolean,
	asDate,
	asNumber,
	asString,
	asyncFunc,
	bigint,
	boolean,
	date,
	func,
	getType,
	instance,
	intersection,
	isAny,
	isArrayOf,
	isAsyncFunction,
	isBigInt,
	isBoolean,
	isDate,
	isFunction,
	isInstanceOf,
	isIntersectionOf,
	isLiteral,
	isLiteralOf,
	isNever,
	isNull,
	isNullable,
	isNullish,
	isNumber,
	isObjectOf,
	isOmitFrom,
	isOptional,
	isOptionalUndefined,
	isPartial,
	isPartialUndefined,
	isPickFrom,
	isPromiseOf,
	isRecordOf,
	isRequired,
	isString,
	isSymbol,
	isTemplateLiteralOf,
	isTupleOf,
	isTupleRestOf,
	isUndefined,
	isUnionOf,
	literal,
	literals,
	never,
	nullable,
	nulled,
	nullish,
	number,
	object,
	omit,
	optional,
	optionalUndef,
	parseType,
	partial,
	partialUndef,
	pick,
	promise,
	record,
	required,
	setStrict,
	strict,
	string,
	symbol,
	templateLiteral,
	tuple,
	tupleRest,
	undef,
	union,
	OptionalTypeGuard,
	RestTypeGuard,
	TransformFunction,
	TypeGuard
} from 'r-assign';
import { expectType } from 'tsd';

// Any
expectType<typeof any>(isAny);
expectType<TypeGuard>(any);

// Array
expectType<typeof array>(isArrayOf);
expectType<TypeGuard<string[]>>(array(string));

// BigInt
expectType<typeof bigint>(isBigInt);
expectType<TypeGuard<bigint>>(bigint);
expectType<TransformFunction<bigint>>(asBigInt);

// Boolean
expectType<typeof boolean>(isBoolean);
expectType<TypeGuard<boolean>>(boolean);
expectType<TransformFunction<boolean>>(asBoolean);

// Date
expectType<typeof date>(isDate);
expectType<TypeGuard<Date>>(date);
expectType<TransformFunction<Date>>(asDate);

// Function
expectType<typeof func>(isFunction);
expectType<typeof asyncFunc>(isAsyncFunction);
expectType<TypeGuard<() => void>>(func([]));
expectType<TypeGuard<() => string>>(func([], string));
expectType<TypeGuard<(args_0: string) => void>>(func([string]));
expectType<TypeGuard<(args_0: string) => string>>(func([string], string));
expectType<TypeGuard<(args_0: string, args_1: string) => void>>(
	func([string, string])
);
expectType<TypeGuard<(args_0: string, args_1: string) => string>>(
	func([string, string], string)
);
expectType<TypeGuard<() => Promise<void>>>(asyncFunc([]));
expectType<TypeGuard<() => Promise<string>>>(asyncFunc([], string));
expectType<TypeGuard<(args_0: string) => Promise<void>>>(asyncFunc([string]));
expectType<TypeGuard<(args_0: string) => Promise<string>>>(
	asyncFunc([string], string)
);
expectType<TypeGuard<(args_0: string, args_1: string) => Promise<void>>>(
	asyncFunc([string, string])
);
expectType<TypeGuard<(args_0: string, args_1: string) => Promise<string>>>(
	asyncFunc([string, string], string)
);

// Instance
expectType<typeof instance>(isInstanceOf);
expectType<TypeGuard<Date>>(instance(Date));

// Intersection
expectType<typeof intersection>(isIntersectionOf);
expectType<TypeGuard<{ a: string; b: string; c: string }>>(
	intersection([
		object({ a: string }),
		object({ b: string }),
		object({ c: string })
	])
);
expectType<TypeGuard<string>>(
	intersection([string, union([string, number]), union([string, boolean])])
);

// Literal
expectType<typeof literal>(isLiteral);
expectType<typeof literals>(isLiteralOf);
expectType<TypeGuard<undefined>>(literal());
expectType<TypeGuard<0>>(literal(0));
expectType<TypeGuard<0>>(literals([0]));
expectType<TypeGuard<0 | 1>>(literals([0, 1]));
expectType<TypeGuard<0 | 0n>>(literals([0, 0n]));
expectType<TypeGuard<0 | 0n | ''>>(literals([0, 0n, '']));
expectType<TypeGuard<0 | 0n | '' | false>>(literals([0, 0n, '', false]));
expectType<TypeGuard<0 | 0n | '' | false | null>>(
	literals([0, 0n, '', false, null])
);
expectType<TypeGuard<0 | 0n | '' | false | null | undefined>>(
	literals([0, 0n, '', false, null, undefined])
);

// Never
expectType<typeof never>(isNever);
expectType<TypeGuard<never>>(never);

// Null
expectType<typeof nulled>(isNull);
expectType<typeof nullable>(isNullable);
expectType<typeof nullish>(isNullish);
expectType<TypeGuard<null>>(nulled);
expectType<TypeGuard<string | null>>(nullable(string));
expectType<TypeGuard<string | null | undefined>>(nullish(string));

// Number
expectType<typeof number>(isNumber);
expectType<TypeGuard<number>>(number);
expectType<TransformFunction<number>>(asNumber);

// Object
expectType<typeof object>(isObjectOf);
expectType<typeof pick>(isPickFrom);
expectType<typeof omit>(isOmitFrom);
expectType<typeof strict>(setStrict);
expectType<TypeGuard<{ a: string }>>(object({ a: string }));
expectType<TypeGuard<{ a: string }>>(strict(object({ a: string })));
expectType<TypeGuard<{ a: string }>>(
	pick(object({ a: string, b: string }), 'a')
);
expectType<TypeGuard<{ b: string }>>(
	omit(object({ a: string, b: string }), 'a')
);

// Optional
expectType<typeof optional>(isOptional);
expectType<typeof optionalUndef>(isOptionalUndefined);
expectType<OptionalTypeGuard<string>>(optional(string));
expectType<OptionalTypeGuard<string | undefined>>(optionalUndef(string));

// Partial
expectType<typeof partial>(isPartial);
expectType<typeof partialUndef>(isPartialUndefined);
expectType<TypeGuard<[string?]>>(partial(tuple([string])));
expectType<TypeGuard<{ a?: string }>>(partial(object({ a: string })));
expectType<TypeGuard<[(string | undefined)?]>>(partialUndef(tuple([string])));
expectType<TypeGuard<{ a?: string | undefined }>>(
	partialUndef(object({ a: string }))
);

// Promise
expectType<typeof promise>(isPromiseOf);
expectType<TypeGuard<Promise<void>>>(promise());
expectType<TypeGuard<Promise<string>>>(promise(string));

// Record
expectType<typeof record>(isRecordOf);
expectType<TypeGuard<Record<string, string>>>(record(string));
expectType<TypeGuard<Record<string, string>>>(record(string, string));

// Required
expectType<typeof required>(isRequired);
expectType<TypeGuard<[string]>>(required(tuple([optional(string)])));

// String
expectType<typeof string>(isString);
expectType<TypeGuard<string>>(string);
expectType<TransformFunction<string>>(asString);

// Symbol
expectType<typeof symbol>(isSymbol);
expectType<TypeGuard<symbol>>(symbol);

// Template literal
expectType<typeof templateLiteral>(isTemplateLiteralOf);
expectType<TypeGuard<''>>(templateLiteral([]));
expectType<TypeGuard<''>>(templateLiteral(['']));
expectType<TypeGuard<'0'>>(templateLiteral([0]));
expectType<TypeGuard<'false'>>(templateLiteral([false]));
expectType<TypeGuard<'false' | 'true'>>(templateLiteral([boolean]));
expectType<TypeGuard<string>>(templateLiteral([string]));
expectType<TypeGuard<`${number}`>>(templateLiteral([number]));
expectType<TypeGuard<`${string}false` | `${string}true`>>(
	templateLiteral([string, boolean])
);
expectType<TypeGuard<`${string}-false` | `${string}-true`>>(
	templateLiteral([string, '-', boolean])
);

// Tuple
expectType<typeof tuple>(isTupleOf);
expectType<typeof tupleRest>(isTupleRestOf);
expectType<TypeGuard<[]>>(tuple([]));
expectType<TypeGuard<[[]]>>(tuple([tuple([])]));
expectType<TypeGuard<[string]>>(tuple([string]));
expectType<TypeGuard<[[string]]>>(tuple([tuple([string])]));
expectType<RestTypeGuard<string>>(tupleRest(string));

expectType<TypeGuard<string[]>>(tuple([tupleRest(string)]));
expectType<TypeGuard<[string, ...string[]]>>(
	tuple([string, tupleRest(string)])
);
expectType<TypeGuard<[...string[], string]>>(
	tuple([tupleRest(string), string])
);
expectType<TypeGuard<[string?, ...string[]]>>(
	tuple([optional(string), tupleRest(string)])
);
expectType<TypeGuard<[string, string?, ...string[]]>>(
	tuple([string, optional(string), tupleRest(string)])
);

// Undefined
expectType<typeof undef>(isUndefined);
expectType<TypeGuard<undefined>>(undef);

// Union
expectType<typeof union>(isUnionOf);
expectType<TypeGuard<string | number>>(union([string, number]));

// Object + Optional
expectType<TypeGuard<{ a?: string }>>(object({ a: optional(string) }));
expectType<TypeGuard<{ a?: string | undefined }>>(
	object({ a: optionalUndef(string) })
);

// Tuple + Optional
expectType<TypeGuard<[string?]>>(tuple([optional(string)]));
expectType<TypeGuard<[(string | undefined)?]>>(tuple([optionalUndef(string)]));

// Get type
expectType<TransformFunction<string>>(getType(string, ''));

// Parse type
expectType<TransformFunction<string>>(parseType(string));