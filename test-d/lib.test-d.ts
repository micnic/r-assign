import { expectDeprecated, expectType } from 'tsd';
import { TransformFunction } from 'r-assign';
import lib, { OptionalTypeGuard, TypeGuard } from 'r-assign/lib';

// Any
expectType<TypeGuard>(lib.any);
expectType<TypeGuard>(lib.isAny);

// Any deprecated
expectType<TransformFunction>(lib.getAny);
expectDeprecated(lib.getAny());
expectType<TransformFunction>(lib.parseAny);
expectDeprecated(lib.parseAny());

// Array
expectType<TypeGuard<string[]>>(lib.array(lib.string));
expectType<TypeGuard<string[]>>(lib.isArrayOf(lib.string));

// Array deprecated
expectType<TransformFunction<string[]>>(lib.getArrayOf(lib.string));
// @ts-expect-error
expectDeprecated(lib.getArrayOf());
expectType<TransformFunction<string[]>>(lib.parseArrayOf(lib.string));
// @ts-expect-error
expectDeprecated(lib.parseArrayOf());

// BigInt
expectType<TypeGuard<bigint>>(lib.bigint);
expectType<TypeGuard<bigint>>(lib.isBigInt);

// BigInt deprecated
expectType<TransformFunction<bigint>>(lib.getBigInt());
expectDeprecated(lib.getBigInt());
expectType<TransformFunction<bigint>>(lib.parseBigInt);
expectDeprecated(lib.parseBigInt());

// Boolean
expectType<TypeGuard<boolean>>(lib.boolean);
expectType<TypeGuard<boolean>>(lib.isBoolean);

// Boolean deprecated
expectType<TransformFunction<boolean>>(lib.getBoolean());
expectDeprecated(lib.getBoolean());
expectType<TransformFunction<boolean>>(lib.parseBoolean);
expectDeprecated(lib.parseBoolean());

// Date
expectType<TypeGuard<Date>>(lib.anyDate);
expectType<TypeGuard<Date>>(lib.date);
expectType<TypeGuard<Date>>(lib.isAnyDate);
expectType<TypeGuard<Date>>(lib.isDate);

// Date deprecated
expectType<TransformFunction<Date>>(lib.convertToAnyDate);
expectDeprecated(lib.convertToAnyDate());
expectType<TransformFunction<Date>>(lib.convertToDate);
expectDeprecated(lib.convertToDate());

// Function
expectType<TypeGuard<() => void>>(lib.func([]));
expectType<TypeGuard<() => void>>(lib.isFunction([]));

// Get type
expectType<TransformFunction<string>>(lib.getType(lib.string, ''));

// Instance
expectType<TypeGuard<Date>>(lib.instance(Date));
expectType<TypeGuard<Date>>(lib.isInstanceOf(Date));

// Instance deprecated
expectType<TransformFunction<Date>>(lib.getInstanceOf(Date, new Date()));
// @ts-expect-error
expectDeprecated(lib.getInstanceOf());
expectType<TransformFunction<Date>>(lib.parseInstanceOf(Date));
// @ts-expect-error
expectDeprecated(lib.parseInstanceOf());

// Intersection
// TBA: expectDeprecated(lib.getIntersectionOf);
expectType<TypeGuard<{ a: string; b: string; c: string; }>>(
	lib.intersection([
		lib.object({ a: lib.string }),
		lib.object({ b: lib.string }),
		lib.object({ c: lib.string })
	])
);
expectType<TypeGuard<string>>(lib.intersection([
	lib.string,
	lib.union([lib.string, lib.number]),
	lib.union([lib.string, lib.boolean])
]));
expectType<TypeGuard<{ a: string; b: string; }>>(
	lib.isIntersectionOf([
		lib.object({ a: lib.string }),
		lib.object({ b: lib.string })
	])
);
expectType<TransformFunction<{ a: string; b: string; }>>(
	lib.parseIntersectionOf([
		lib.object({ a: lib.string }),
		lib.object({ b: lib.string })
	])
);
// TBA: expectDeprecated(lib.parseIntersectionOf);

// Literal
expectType<TypeGuard<0>>(lib.isLiteral(0));
expectType<TypeGuard<0 | 1>>(lib.isLiteralOf([0, 1]));
expectType<TypeGuard<0>>(lib.literal(0));
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
expectType<TransformFunction<0 | 1>>(lib.getLiteralOf([0, 1]));
// @ts-expect-error
expectDeprecated(lib.getLiteralOf());
expectType<TransformFunction<0>>(lib.parseLiteral(0));
// @ts-expect-error
expectDeprecated(lib.parseLiteral());
expectType<TransformFunction<0 | 1>>(lib.parseLiteralOf([0, 1]));
// @ts-expect-error
expectDeprecated(lib.parseLiteralOf());

// Null
expectType<TypeGuard<null>>(lib.isNull);
expectType<TypeGuard<string | null>>(lib.isNullable(lib.string));
expectType<TypeGuard<string | null | undefined>>(lib.isNullish(lib.string));
expectType<TypeGuard<string | null>>(lib.nullable(lib.string));
expectType<TypeGuard<null>>(lib.nulled);
expectType<TypeGuard<string | null | undefined>>(lib.nullish(lib.string));

// Null deprecated
expectType<TransformFunction<null>>(lib.getNull);
expectDeprecated(lib.getNull());
expectType<TransformFunction<string | null>>(lib.getNullable(lib.getString()));
// @ts-expect-error
expectDeprecated(lib.getNullable());
expectType<TransformFunction<null>>(lib.parseNull);
expectDeprecated(lib.parseNull());
expectType<TransformFunction<string | null>>(lib.parseNullable(lib.string));
// @ts-expect-error
expectDeprecated(lib.parseNullable());

// Number
expectType<TypeGuard<number>>(lib.anyNumber);
expectType<TypeGuard<number>>(lib.isAnyNumber);
expectType<TypeGuard<number>>(lib.isNumber);
expectType<TypeGuard<number>>(lib.number);

// Number deprecated
expectType<TransformFunction<number>>(lib.getAnyNumber());
expectDeprecated(lib.getAnyNumber());
expectType<TransformFunction<number>>(lib.getNumber());
expectDeprecated(lib.getNumber());
expectType<TransformFunction<number>>(lib.parseAnyNumber);
expectDeprecated(lib.parseAnyNumber());
expectType<TransformFunction<number>>(lib.parseNumber);
expectDeprecated(lib.parseNumber());

// Object
expectType<TypeGuard<{ a: string }>>(lib.isObjectOf({ a: lib.string }));
expectType<TypeGuard<{ a: string }>>(lib.isStrictObjectOf({ a: lib.string }));
expectType<TypeGuard<{ a: string }>>(lib.object({ a: lib.string }));
expectType<TypeGuard<{ a: string }>>(lib.strictObject({ a: lib.string }));

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
expectType<OptionalTypeGuard<string>>(lib.isOptional(lib.string));
expectType<OptionalTypeGuard<string | undefined>>(
	lib.isOptionalUndefined(lib.string)
);
expectType<OptionalTypeGuard<string>>(lib.optional(lib.string));
expectType<OptionalTypeGuard<string | undefined>>(
	lib.optionalUndef(lib.string)
);

// Optional deprecated
expectType<TransformFunction<string | undefined>>(
	lib.getOptional(lib.getString())
);
// @ts-expect-error
expectDeprecated(lib.getOptional());
expectType<TransformFunction<string | undefined>>(
	lib.parseOptional(lib.string)
);
// @ts-expect-error
expectDeprecated(lib.parseOptional());

// Parse type
expectType<TransformFunction<string>>(lib.parseType(lib.string));

// Record
expectType<TypeGuard<Record<string, string>>>(
	lib.isRecordOf(lib.string, lib.string)
);
expectType<TypeGuard<Record<string, string>>>(
	lib.record(lib.string, lib.string)
);

// String
expectType<TransformFunction<string>>(lib.asString);
expectType<TypeGuard<string>>(lib.isString);
expectType<TypeGuard<string>>(lib.string);

// String deprecated
expectType<TransformFunction<string>>(lib.convertToString);
expectDeprecated(lib.convertToString());
expectType<TransformFunction<string>>(lib.getString());
expectDeprecated(lib.getString());
expectType<TransformFunction<string>>(lib.parseString);
expectDeprecated(lib.parseString());

// Symbol
expectType<TypeGuard<symbol>>(lib.isSymbol);
expectType<TypeGuard<symbol>>(lib.symbol);

// Symbol deprecated
expectType<TransformFunction<symbol>>(lib.getSymbol());
expectDeprecated(lib.getSymbol());
expectType<TransformFunction<symbol>>(lib.parseSymbol);
expectDeprecated(lib.parseSymbol());

// Template literal
expectType<TypeGuard<''>>(lib.isTemplateLiteralOf([]));
expectType<TypeGuard<''>>(lib.templateLiteral([]));

// Tuple
expectType<TypeGuard<[]>>(lib.isTupleOf([]));
expectType<TypeGuard<[]>>(lib.tuple([]));
expectType<TypeGuard<[[]]>>(lib.tuple([lib.tuple([])]));
expectType<TypeGuard<[string]>>(lib.tuple([lib.string]));
expectType<TypeGuard<[[string]]>>(lib.tuple([lib.tuple([lib.string])]));

// Tuple deprecated
expectType<TransformFunction<[]>>(lib.getTupleOf([], []));
// @ts-expect-error
expectDeprecated(lib.getTupleOf());
expectType<TransformFunction<[]>>(lib.parseTupleOf([]));
// @ts-expect-error
expectDeprecated(lib.parseTupleOf());

// Undefined
expectType<TypeGuard<undefined>>(lib.isUndefined);
expectType<TypeGuard<undefined>>(lib.undef);

// Union
expectType<TypeGuard<string | number>>(lib.isUnionOf([lib.string, lib.number]));
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
expectType<TypeGuard<[string?]>>(
	lib.tuple([lib.optional(lib.string)])
);
expectType<TypeGuard<[(string | undefined)?]>>(
	lib.tuple([lib.optionalUndef(lib.string)])
);