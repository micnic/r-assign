import * as lib from 'r-assign';
import { expectType } from 'tsd';

// Any
expectType<typeof lib.any>(lib.isAny);
expectType<lib.AnyTypeGuard>(lib.any);

// Array
expectType<typeof lib.array>(lib.isArrayOf);
expectType<lib.TypeGuard<string[]>>(lib.array(lib.string));

// BigInt
expectType<typeof lib.bigint>(lib.isBigInt);
expectType<lib.TypeGuard<bigint>>(lib.bigint);

// Boolean
expectType<typeof lib.boolean>(lib.isBoolean);
expectType<lib.TypeGuard<boolean>>(lib.boolean);

// Date
expectType<typeof lib.date>(lib.isDate);
expectType<lib.TypeGuard<Date>>(lib.date);

// Function
expectType<typeof lib.func>(lib.isFunction);
expectType<typeof lib.asyncFunc>(lib.isAsyncFunction);
expectType<lib.TypeGuard<() => void>>(lib.func([]));
expectType<lib.TypeGuard<() => string>>(lib.func([], lib.string));
expectType<lib.TypeGuard<(args_0: string) => void>>(lib.func([lib.string]));
expectType<lib.TypeGuard<(args_0: string) => string>>(
	lib.func([lib.string], lib.string)
);
expectType<lib.TypeGuard<(args_0: string, args_1: string) => void>>(
	lib.func([lib.string, lib.string])
);
expectType<lib.TypeGuard<(args_0: string, args_1: string) => string>>(
	lib.func([lib.string, lib.string], lib.string)
);
expectType<lib.TypeGuard<() => Promise<void>>>(lib.asyncFunc([]));
expectType<lib.TypeGuard<() => Promise<string>>>(lib.asyncFunc([], lib.string));
expectType<lib.TypeGuard<(args_0: string) => Promise<void>>>(
	lib.asyncFunc([lib.string])
);
expectType<lib.TypeGuard<(args_0: string) => Promise<string>>>(
	lib.asyncFunc([lib.string], lib.string)
);
expectType<lib.TypeGuard<(args_0: string, args_1: string) => Promise<void>>>(
	lib.asyncFunc([lib.string, lib.string])
);
expectType<lib.TypeGuard<(args_0: string, args_1: string) => Promise<string>>>(
	lib.asyncFunc([lib.string, lib.string], lib.string)
);

// Instance
expectType<typeof lib.instance>(lib.isInstanceOf);
expectType<lib.TypeGuard<Date>>(lib.instance(Date));

// Intersection
expectType<typeof lib.intersection>(lib.isIntersectionOf);
expectType<lib.TypeGuard<{ a: string; b: string; c: string }>>(
	lib.intersection([
		lib.object({ a: lib.string }),
		lib.object({ b: lib.string }),
		lib.object({ c: lib.string })
	])
);
expectType<lib.TypeGuard<string>>(
	lib.intersection([
		lib.string,
		lib.union([lib.string, lib.number]),
		lib.union([lib.string, lib.boolean])
	])
);

// Literal
expectType<typeof lib.literal>(lib.isLiteral);
expectType<typeof lib.literals>(lib.isLiteralOf);
expectType<lib.TypeGuard<0>>(lib.literal(0));
expectType<lib.TypeGuard<0>>(lib.literals([0]));
expectType<lib.TypeGuard<0 | 1>>(lib.literals([0, 1]));
expectType<lib.TypeGuard<0 | 0n>>(lib.literals([0, 0n]));
expectType<lib.TypeGuard<0 | 0n | ''>>(lib.literals([0, 0n, '']));
expectType<lib.TypeGuard<0 | 0n | '' | false>>(
	lib.literals([0, 0n, '', false])
);
expectType<lib.TypeGuard<0 | 0n | '' | false | null>>(
	lib.literals([0, 0n, '', false, null])
);
expectType<lib.TypeGuard<0 | 0n | '' | false | null | undefined>>(
	lib.literals([0, 0n, '', false, null, undefined])
);

// Never
expectType<typeof lib.never>(lib.isNever);
expectType<lib.TypeGuard<never>>(lib.never);

// Null
expectType<typeof lib.nulled>(lib.isNull);
expectType<typeof lib.nullable>(lib.isNullable);
expectType<typeof lib.nullish>(lib.isNullish);
expectType<lib.TypeGuard<null>>(lib.nulled);
expectType<lib.TypeGuard<string | null>>(lib.nullable(lib.string));
expectType<lib.TypeGuard<string | null | undefined>>(lib.nullish(lib.string));

// Number
expectType<typeof lib.number>(lib.isNumber);
expectType<lib.TypeGuard<number>>(lib.number);

// Object
expectType<typeof lib.object>(lib.isObjectOf);
expectType<typeof lib.strictObject>(lib.isStrictObjectOf);
expectType<typeof lib.pick>(lib.isPickFrom);
expectType<typeof lib.omit>(lib.isOmitFrom);
expectType<lib.TypeGuard<{ a: string }>>(lib.object({ a: lib.string }));
expectType<lib.TypeGuard<{ a: string }>>(lib.strictObject({ a: lib.string }));
expectType<lib.TypeGuard<{ a: string }>>(
	lib.pick(lib.object({ a: lib.string, b: lib.string }), 'a')
);
expectType<lib.TypeGuard<{ b: string }>>(
	lib.omit(lib.object({ a: lib.string, b: lib.string }), 'a')
);

// Optional
expectType<typeof lib.optional>(lib.isOptional);
expectType<typeof lib.optionalUndef>(lib.isOptionalUndefined);
expectType<lib.OptionalTypeGuard<string>>(lib.optional(lib.string));
expectType<lib.OptionalTypeGuard<string | undefined>>(
	lib.optionalUndef(lib.string)
);

// Partial
expectType<typeof lib.partial>(lib.isPartial);
expectType<typeof lib.partialUndef>(lib.isPartialUndefined);
expectType<lib.TypeGuard<[string?]>>(lib.partial(lib.tuple([lib.string])));
expectType<lib.TypeGuard<{ a?: string }>>(
	lib.partial(lib.object({ a: lib.string }))
);
expectType<lib.TypeGuard<[(string | undefined)?]>>(
	lib.partialUndef(lib.tuple([lib.string]))
);
expectType<lib.TypeGuard<{ a?: string | undefined }>>(
	lib.partialUndef(lib.object({ a: lib.string }))
);

// Promise
expectType<typeof lib.promise>(lib.isPromiseOf);
expectType<lib.TypeGuard<Promise<void>>>(lib.promise());
expectType<lib.TypeGuard<Promise<string>>>(lib.promise(lib.string));

// Record
expectType<typeof lib.record>(lib.isRecordOf);
expectType<lib.TypeGuard<Record<string, string>>>(lib.record(lib.string));
expectType<lib.TypeGuard<Record<string, string>>>(
	lib.record(lib.string, lib.string)
);

// Required
expectType<typeof lib.required>(lib.isRequired);
expectType<lib.TypeGuard<[string]>>(
	lib.required(lib.tuple([lib.optional(lib.string)]))
);

// String
expectType<typeof lib.string>(lib.isString);
expectType<lib.TypeGuard<string>>(lib.string);
expectType<lib.TransformFunction<string>>(lib.asString);

// Symbol
expectType<typeof lib.symbol>(lib.isSymbol);
expectType<lib.TypeGuard<symbol>>(lib.symbol);

// Template literal
expectType<typeof lib.templateLiteral>(lib.isTemplateLiteralOf);
expectType<lib.TypeGuard<''>>(lib.templateLiteral([]));
expectType<lib.TypeGuard<''>>(lib.templateLiteral(['']));
expectType<lib.TypeGuard<'0'>>(lib.templateLiteral([0]));
expectType<lib.TypeGuard<'false'>>(lib.templateLiteral([false]));
expectType<lib.TypeGuard<'false' | 'true'>>(lib.templateLiteral([lib.boolean]));
expectType<lib.TypeGuard<string>>(lib.templateLiteral([lib.string]));
expectType<lib.TypeGuard<`${number}`>>(lib.templateLiteral([lib.number]));
expectType<lib.TypeGuard<`${string}false` | `${string}true`>>(
	lib.templateLiteral([lib.string, lib.boolean])
);
expectType<lib.TypeGuard<`${string}-false` | `${string}-true`>>(
	lib.templateLiteral([lib.string, '-', lib.boolean])
);

// Tuple
expectType<typeof lib.tuple>(lib.isTupleOf);
expectType<typeof lib.tupleRest>(lib.isTupleRestOf);
expectType<lib.TypeGuard<[]>>(lib.tuple([]));
expectType<lib.TypeGuard<[[]]>>(lib.tuple([lib.tuple([])]));
expectType<lib.TypeGuard<[string]>>(lib.tuple([lib.string]));
expectType<lib.TypeGuard<[[string]]>>(lib.tuple([lib.tuple([lib.string])]));
expectType<lib.RestTypeGuard<string>>(lib.tupleRest(lib.string));

expectType<lib.TypeGuard<string[]>>(lib.tuple([lib.tupleRest(lib.string)]));
expectType<lib.TypeGuard<[string, ...string[]]>>(
	lib.tuple([lib.string, lib.tupleRest(lib.string)])
);
expectType<lib.TypeGuard<[...string[], string]>>(
	lib.tuple([lib.tupleRest(lib.string), lib.string])
);
expectType<lib.TypeGuard<[string?, ...string[]]>>(
	lib.tuple([lib.optional(lib.string), lib.tupleRest(lib.string)])
);
expectType<lib.TypeGuard<[string, string?, ...string[]]>>(
	lib.tuple([lib.string, lib.optional(lib.string), lib.tupleRest(lib.string)])
);

// Undefined
expectType<typeof lib.undef>(lib.isUndefined);
expectType<lib.TypeGuard<undefined>>(lib.undef);

// Union
expectType<typeof lib.union>(lib.isUnionOf);
expectType<lib.TypeGuard<string | number>>(lib.union([lib.string, lib.number]));

// Object + Optional
expectType<lib.TypeGuard<{ a?: string }>>(
	lib.object({ a: lib.optional(lib.string) })
);
expectType<lib.TypeGuard<{ a?: string | undefined }>>(
	lib.object({ a: lib.optionalUndef(lib.string) })
);

// Object + Record
expectType<lib.TypeGuard<{ [x: string]: string; a: string }>>(
	lib.object({ a: lib.string }, lib.record(lib.string, lib.string))
);

// Tuple + Optional
expectType<lib.TypeGuard<[string?]>>(lib.tuple([lib.optional(lib.string)]));
expectType<lib.TypeGuard<[(string | undefined)?]>>(
	lib.tuple([lib.optionalUndef(lib.string)])
);

// Get type
expectType<lib.TransformFunction<string>>(lib.getType(lib.string, ''));

// Parse type
expectType<lib.TransformFunction<string>>(lib.parseType(lib.string));