import { TransformFunction } from 'r-assign';
import lib, {
	AnyTypeGuard,
	OptionalTypeGuard,
	RestTypeGuard,
	TypeGuard
} from 'r-assign/lib';
import { expectDeprecated, expectType } from 'tsd';

// Any
expectType<typeof lib.any>(lib.isAny);
expectType<AnyTypeGuard>(lib.any);

// Any deprecated
expectType<TransformFunction>(lib.getAny);
expectDeprecated(lib.getAny());
expectType<TransformFunction>(lib.parseAny);
expectDeprecated(lib.parseAny());

// Array
expectType<typeof lib.array>(lib.isArrayOf);
expectType<TypeGuard<string[]>>(lib.array(lib.string));

// Array deprecated
expectType<TransformFunction<string[]>>(lib.getArrayOf(lib.string));
// @ts-expect-error
expectDeprecated(lib.getArrayOf());
expectType<TransformFunction<string[]>>(lib.parseArrayOf(lib.string));
// @ts-expect-error
expectDeprecated(lib.parseArrayOf());

// BigInt
expectType<typeof lib.bigint>(lib.isBigInt);
expectType<TypeGuard<bigint>>(lib.bigint);

// BigInt deprecated
expectType<TransformFunction<bigint>>(lib.getBigInt());
expectDeprecated(lib.getBigInt());
expectType<TransformFunction<bigint>>(lib.parseBigInt);
expectDeprecated(lib.parseBigInt());

// Boolean
expectType<typeof lib.boolean>(lib.isBoolean);
expectType<TypeGuard<boolean>>(lib.boolean);

// Boolean deprecated
expectType<TransformFunction<boolean>>(lib.getBoolean());
expectDeprecated(lib.getBoolean());
expectType<TransformFunction<boolean>>(lib.parseBoolean);
expectDeprecated(lib.parseBoolean());

// Date
expectType<typeof lib.date>(lib.isDate);
expectType<TypeGuard<Date>>(lib.date);

// Date deprecated
expectType<TypeGuard<Date>>(lib.anyDate);
expectType<TransformFunction<Date>>(lib.convertToAnyDate);
expectDeprecated(lib.convertToAnyDate());
expectType<TransformFunction<Date>>(lib.convertToDate);
expectDeprecated(lib.convertToDate());
expectType<TypeGuard<Date>>(lib.isAnyDate);

// Function
expectType<typeof lib.func>(lib.isFunction);
expectType<typeof lib.asyncFunc>(lib.isAsyncFunction);
expectType<TypeGuard<() => void>>(lib.func([]));
expectType<TypeGuard<() => string>>(lib.func([], lib.string));
expectType<TypeGuard<(args_0: string) => void>>(lib.func([lib.string]));
expectType<TypeGuard<(args_0: string) => string>>(
	lib.func([lib.string], lib.string)
);
expectType<TypeGuard<(args_0: string, args_1: string) => void>>(
	lib.func([lib.string, lib.string])
);
expectType<TypeGuard<(args_0: string, args_1: string) => string>>(
	lib.func([lib.string, lib.string], lib.string)
);
expectType<TypeGuard<() => Promise<void>>>(lib.asyncFunc([]));
expectType<TypeGuard<() => Promise<string>>>(lib.asyncFunc([], lib.string));
expectType<TypeGuard<(args_0: string) => Promise<void>>>(
	lib.asyncFunc([lib.string])
);
expectType<TypeGuard<(args_0: string) => Promise<string>>>(
	lib.asyncFunc([lib.string], lib.string)
);
expectType<TypeGuard<(args_0: string, args_1: string) => Promise<void>>>(
	lib.asyncFunc([lib.string, lib.string])
);
expectType<TypeGuard<(args_0: string, args_1: string) => Promise<string>>>(
	lib.asyncFunc([lib.string, lib.string], lib.string)
);

// Instance
expectType<typeof lib.instance>(lib.isInstanceOf);
expectType<TypeGuard<Date>>(lib.instance(Date));

// Instance deprecated
expectType<TransformFunction<Date>>(lib.getInstanceOf(Date, new Date()));
// @ts-expect-error
expectDeprecated(lib.getInstanceOf());
expectType<TransformFunction<Date>>(lib.parseInstanceOf(Date));
// @ts-expect-error
expectDeprecated(lib.parseInstanceOf());

// Intersection
expectType<typeof lib.intersection>(lib.isIntersectionOf);
expectType<TypeGuard<{ a: string; b: string; c: string }>>(
	lib.intersection([
		lib.object({ a: lib.string }),
		lib.object({ b: lib.string }),
		lib.object({ c: lib.string })
	])
);
expectType<TypeGuard<string>>(
	lib.intersection([
		lib.string,
		lib.union([lib.string, lib.number]),
		lib.union([lib.string, lib.boolean])
	])
);
// @ts-expect-error
expectDeprecated(lib.getIntersectionOf());
expectType<TransformFunction<{ a: string; b: string }>>(
	lib.parseIntersectionOf([
		lib.object({ a: lib.string }),
		lib.object({ b: lib.string })
	])
);
// @ts-expect-error
expectDeprecated(lib.parseIntersectionOf());

// Literal
expectType<typeof lib.literal>(lib.isLiteral);
expectType<typeof lib.literals>(lib.isLiteralOf);
expectType<TypeGuard<0>>(lib.literal(0));
expectType<TypeGuard<0>>(lib.literals([0]));
expectType<TypeGuard<0 | 1>>(lib.literals([0, 1]));
expectType<TypeGuard<0 | 0n>>(lib.literals([0, 0n]));
expectType<TypeGuard<0 | 0n | ''>>(lib.literals([0, 0n, '']));
expectType<TypeGuard<0 | 0n | '' | false>>(lib.literals([0, 0n, '', false]));
expectType<TypeGuard<0 | 0n | '' | false | null>>(
	lib.literals([0, 0n, '', false, null])
);
expectType<TypeGuard<0 | 0n | '' | false | null | undefined>>(
	lib.literals([0, 0n, '', false, null, undefined])
);

// Literal deprecated
expectType<TransformFunction<0>>(lib.getLiteral(0));
// @ts-expect-error
expectDeprecated(lib.getLiteral());
expectType<TransformFunction<0 | 1>>(lib.getLiteralOf([0, 1], 0));
// @ts-expect-error
expectDeprecated(lib.getLiteralOf());
expectType<TransformFunction<0>>(lib.parseLiteral(0));
// @ts-expect-error
expectDeprecated(lib.parseLiteral());
expectType<TransformFunction<0 | 1>>(lib.parseLiteralOf([0, 1]));
// @ts-expect-error
expectDeprecated(lib.parseLiteralOf());

// Never
expectType<typeof lib.never>(lib.isNever);
expectType<TypeGuard<never>>(lib.never);

// Null
expectType<typeof lib.nulled>(lib.isNull);
expectType<typeof lib.nullable>(lib.isNullable);
expectType<typeof lib.nullish>(lib.isNullish);
expectType<TypeGuard<null>>(lib.nulled);
expectType<TypeGuard<string | null>>(lib.nullable(lib.string));
expectType<TypeGuard<string | null | undefined>>(lib.nullish(lib.string));

// Null deprecated
expectType<TransformFunction<null>>(lib.getNull);
expectDeprecated(lib.getNull());
expectType<TransformFunction<string | null>>(lib.getNullable(lib.string));
// @ts-expect-error
expectDeprecated(lib.getNullable());
expectType<TransformFunction<null>>(lib.parseNull);
expectDeprecated(lib.parseNull());
expectType<TransformFunction<string | null>>(lib.parseNullable(lib.string));
// @ts-expect-error
expectDeprecated(lib.parseNullable());

// Number
expectType<typeof lib.number>(lib.isNumber);
expectType<TypeGuard<number>>(lib.number);

// Number deprecated
expectType<TypeGuard<number>>(lib.anyNumber);
expectType<TransformFunction<number>>(lib.getAnyNumber());
expectDeprecated(lib.getAnyNumber());
expectType<TransformFunction<number>>(lib.getNumber());
expectDeprecated(lib.getNumber());
expectType<TypeGuard<number>>(lib.isAnyNumber);
expectType<TransformFunction<number>>(lib.parseAnyNumber);
expectDeprecated(lib.parseAnyNumber());
expectType<TransformFunction<number>>(lib.parseNumber);
expectDeprecated(lib.parseNumber());

// Object
expectType<typeof lib.object>(lib.isObjectOf);
expectType<typeof lib.strictObject>(lib.isStrictObjectOf);
expectType<typeof lib.pick>(lib.isPickFrom);
expectType<typeof lib.omit>(lib.isOmitFrom);
expectType<TypeGuard<{ a: string }>>(lib.object({ a: lib.string }));
expectType<TypeGuard<{ a: string }>>(lib.strictObject({ a: lib.string }));
expectType<TypeGuard<{ a: string }>>(
	lib.pick(lib.object({ a: lib.string, b: lib.string }), 'a')
);
expectType<TypeGuard<{ b: string }>>(
	lib.omit(lib.object({ a: lib.string, b: lib.string }), 'a')
);

// Object deprecated
expectType<TransformFunction<{ a: string }>>(
	lib.getObjectOf({ a: lib.string }, { a: '' })
);
// @ts-expect-error
expectDeprecated(lib.getObjectOf());
expectType<TransformFunction<{ a: string }>>(
	lib.getStrictObjectOf({ a: lib.string }, { a: '' })
);
// @ts-expect-error
expectDeprecated(lib.getStrictObjectOf());
expectType<TransformFunction<{ a: string }>>(
	lib.parseObjectOf({ a: lib.string })
);
// @ts-expect-error
expectDeprecated(lib.parseObjectOf());
expectType<TransformFunction<{ a: string }>>(
	lib.parseStrictObjectOf({ a: lib.string })
);
// @ts-expect-error
expectDeprecated(lib.parseStrictObjectOf());

// Optional
expectType<typeof lib.optional>(lib.isOptional);
expectType<typeof lib.optionalUndef>(lib.isOptionalUndefined);
expectType<OptionalTypeGuard<string>>(lib.optional(lib.string));
expectType<OptionalTypeGuard<string | undefined>>(
	lib.optionalUndef(lib.string)
);

// Partial
expectType<typeof lib.partial>(lib.isPartial);
expectType<typeof lib.partialUndef>(lib.isPartialUndefined);
expectType<TypeGuard<[string?]>>(lib.partial(lib.tuple([lib.string])));
expectType<TypeGuard<{ a?: string }>>(
	lib.partial(lib.object({ a: lib.string }))
);
expectType<TypeGuard<[(string | undefined)?]>>(
	lib.partialUndef(lib.tuple([lib.string]))
);
expectType<TypeGuard<{ a?: string | undefined }>>(
	lib.partialUndef(lib.object({ a: lib.string }))
);

// Promise
expectType<typeof lib.promise>(lib.isPromiseOf);
expectType<TypeGuard<Promise<void>>>(lib.promise());
expectType<TypeGuard<Promise<string>>>(lib.promise(lib.string));

// Record
expectType<typeof lib.record>(lib.isRecordOf);
expectType<TypeGuard<Record<string, string>>>(lib.record(lib.string));
expectType<TypeGuard<Record<string, string>>>(
	lib.record(lib.string, lib.string)
);

// Required
expectType<typeof lib.required>(lib.isRequired);
expectType<TypeGuard<[string]>>(
	lib.required(lib.tuple([lib.optional(lib.string)]))
);

// String
expectType<typeof lib.string>(lib.isString);
expectType<TypeGuard<string>>(lib.string);
expectType<TransformFunction<string>>(lib.asString);

// String deprecated
expectType<TransformFunction<string>>(lib.convertToString);
expectDeprecated(lib.convertToString());
expectType<TransformFunction<string>>(lib.getString());
expectDeprecated(lib.getString());
expectType<TransformFunction<string>>(lib.parseString);
expectDeprecated(lib.parseString());

// Symbol
expectType<typeof lib.symbol>(lib.isSymbol);
expectType<TypeGuard<symbol>>(lib.symbol);

// Symbol deprecated
expectType<TransformFunction<symbol>>(lib.getSymbol());
expectDeprecated(lib.getSymbol());
expectType<TransformFunction<symbol>>(lib.parseSymbol);
expectDeprecated(lib.parseSymbol());

// Template literal
expectType<typeof lib.templateLiteral>(lib.isTemplateLiteralOf);
expectType<TypeGuard<''>>(lib.templateLiteral([]));
expectType<TypeGuard<''>>(lib.templateLiteral(['']));
expectType<TypeGuard<'0'>>(lib.templateLiteral([0]));
expectType<TypeGuard<'false'>>(lib.templateLiteral([false]));
expectType<TypeGuard<'false' | 'true'>>(lib.templateLiteral([lib.boolean]));
expectType<TypeGuard<string>>(lib.templateLiteral([lib.string]));
expectType<TypeGuard<`${number}`>>(lib.templateLiteral([lib.number]));
expectType<TypeGuard<`${string}false` | `${string}true`>>(
	lib.templateLiteral([lib.string, lib.boolean])
);
expectType<TypeGuard<`${string}-false` | `${string}-true`>>(
	lib.templateLiteral([lib.string, '-', lib.boolean])
);

// Tuple
expectType<typeof lib.tuple>(lib.isTupleOf);
expectType<typeof lib.tupleRest>(lib.isTupleRestOf);
expectType<TypeGuard<[]>>(lib.tuple([]));
expectType<TypeGuard<[[]]>>(lib.tuple([lib.tuple([])]));
expectType<TypeGuard<[string]>>(lib.tuple([lib.string]));
expectType<TypeGuard<[[string]]>>(lib.tuple([lib.tuple([lib.string])]));
expectType<RestTypeGuard<string>>(lib.tupleRest(lib.string));

expectType<TypeGuard<string[]>>(lib.tuple([lib.tupleRest(lib.string)]));
expectType<TypeGuard<[string, ...string[]]>>(
	lib.tuple([lib.string, lib.tupleRest(lib.string)])
);
expectType<TypeGuard<[...string[], string]>>(
	lib.tuple([lib.tupleRest(lib.string), lib.string])
);
expectType<TypeGuard<[string?, ...string[]]>>(
	lib.tuple([lib.optional(lib.string), lib.tupleRest(lib.string)])
);
expectType<TypeGuard<[string, string?, ...string[]]>>(
	lib.tuple([lib.string, lib.optional(lib.string), lib.tupleRest(lib.string)])
);

// Tuple deprecated
expectType<TransformFunction<[]>>(lib.getTupleOf([], []));
// @ts-expect-error
expectDeprecated(lib.getTupleOf());
expectType<TransformFunction<[]>>(lib.parseTupleOf([]));
// @ts-expect-error
expectDeprecated(lib.parseTupleOf());

// Undefined
expectType<typeof lib.undef>(lib.isUndefined);
expectType<TypeGuard<undefined>>(lib.undef);

// Union
expectType<typeof lib.union>(lib.isUnionOf);
expectType<TypeGuard<string | number>>(lib.union([lib.string, lib.number]));

// Union deprecated
expectType<TransformFunction<string | number>>(
	lib.getUnionOf([lib.string, lib.number], '')
);
// @ts-expect-error
expectDeprecated(lib.getUnionOf());
expectType<TransformFunction<string | number>>(
	lib.parseUnionOf([lib.string, lib.number])
);
// @ts-expect-error
expectDeprecated(lib.parseUnionOf());

// Object + Optional
expectType<TypeGuard<{ a?: string }>>(
	lib.object({ a: lib.optional(lib.string) })
);
expectType<TypeGuard<{ a?: string | undefined }>>(
	lib.object({ a: lib.optionalUndef(lib.string) })
);

// Object + Record
expectType<TypeGuard<{ [x: string]: string; a: string }>>(
	lib.object({ a: lib.string }, lib.record(lib.string, lib.string))
);

// Tuple + Optional
expectType<TypeGuard<[string?]>>(lib.tuple([lib.optional(lib.string)]));
expectType<TypeGuard<[(string | undefined)?]>>(
	lib.tuple([lib.optionalUndef(lib.string)])
);

// Get type
expectType<TransformFunction<string>>(lib.getType(lib.string, ''));

// Parse type
expectType<TransformFunction<string>>(lib.parseType(lib.string));