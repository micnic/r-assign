# r-assign

[![npm version](https://img.shields.io/npm/v/r-assign.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/r-assign)
[![coveralls](https://img.shields.io/coveralls/github/micnic/r-assign?style=flat-square)](https://coveralls.io/github/micnic/r-assign)
[![npm downloads](https://img.shields.io/npm/dm/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
[![npm types](https://img.shields.io/npm/types/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
[![license](https://img.shields.io/npm/l/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)

`Object.assign()` with a transforming feature for filtering, mapping, and
validating object properties.

`r-assign` has its own schema declaration based on the concept of TypeScript
type guards, it is composed of pure functions that can be used separately from
`r-assign`.

When to use `r-assign`?
- When needing to apply filtering or mapping of object properties
- When dealing with data from untrustworthy sources, to validate and parse them
- When providing a configurable interface with strict constraints
- When doing complex transformations in objects with interdependent properties
- When reinforcing TypeScript declarations in runtime

Reasons to use `r-assign`:
- Functional approach
- Modular, import only what you need without bloating your project
- TypeScript support
- Expressive in defining complex schemas
- Flexible to create custom transforming functional
- Helpful at preventing undesired values (like `NaN` when working with numbers
or `Invalid Date` when working with dates)

## Table of contents
- [Install](#install)
- [Usage](#usage)
- [Import utility functions](#import-utility-functions)
- [Type guards](#type-guards)
- [Parsing data](#parsing-data)
- [Getting data](#getting-data)
- [Working with TypeScript](#working-with-typescript)
- [Mapping properties](#mapping-properties)
- [Filtering properties](#filtering-properties)
- [Complex interactions](#complex-interactions)

## Install

`npm i r-assign`

To take advantage of all TypeScript features in `r-assign` use latest TypeScript
versions and configure the compiler options with `strict` and
`exactOptionalPropertyTypes` enabled. `exactOptionalPropertyTypes` option is
required for the usage of `isOptional()` type guard, if the option is not
enabled the `isOptionalUndefined()` type guard should be used instead.

### ESM import

```js
import rAssign from 'r-assign';
```

### CJS require

```js
const rAssign = require('r-assign');
```

## Usage

```ts
type TransformSchema<T = any> = {
    [key: string]: (value: any, key: string, source: any) => T;
};

rAssign(schema: TransformSchema, ...sources: any[]): any;

// Note: The actual TypeScript definition is a bit more complex. Here is
//       displayed a simplified definition for an easier understanding of the
//       function signature and schema structure.
```

`r-assign` exports a function that accepts a `schema` object as the first
argument that defines the structure of the result by merging and transforming of
any `source` objects provided as the following arguments.

The `schema` argument is a user-defined object with properties as functions that
return a value based on the provided input from 3 arguments:

`(value: any, key: string, source: any) => any`
- the `value` from the source
- the `key` of the value
- the `source` itself

The returned value from the function will be part of the resulting object,
`undefined` values are skipped. The `r-assign` function will throw when any of
the provided functions from the `schema` throws.

<img src="diagram.svg"/>

### A very first example
```js
import rAssign from 'r-assign';

const someUnknownObject = { /* ... any structure here ... */ };

const objectABC = rAssign({
    abc: (value) => {

        // Check the type of the provided value
        if (typeof value === 'string') {

            return value; // Return the value itself   --------------------+
        }                                                               // |
                                                                        // |
        return 'abc'; // Return a default value        --------------------+
    }                                                                   // |
}, someUnknownObject);                                                  // |
                                                                        // |
/*                                                                         |
objectABC: {      Add the output of the function to the resulting object   |
    abc: 'abc' <-----------------------------------------------------------+
};
*/
```

Here is a very simple example of the basics of what `r-assign` can do. The
functions output provided in the schema is added to the resulting object. As the
schema is composed only of functions it can define very complex and flexible
functional. There are utility functions to simplify this example to the
following:

```js
import rAssign from 'r-assign';
import { getType } from 'r-assign/lib/get-type';
import { isString } from 'r-assign/lib/string';

const someUnknownObject = { /* ... any structure here ... */ };

const objectABC = rAssign({
    // Will return a string or the default value of "abc"
    abc: getType(isString, 'abc')
}, someUnknownObject);
```

## Import utility functions
```js
// Import all the needed functions from "r-assign/lib" submodule
import { getType, isNumber, isString } from 'r-assign/lib';

// Or import functions from specific submodule
import { getType } from 'r-assign/lib/get-type';
import { isNumber } from 'r-assign/lib/number';
import { isString } from 'r-assign/lib/string';
```

All utility functions are available for importing from `r-assign/lib`. To
prevent importing all the library it is recommended to import just the specific
submodules that will be used. The list of the available submodules is the
following:

Primitives:
- `r-assign/lib/any` - for any values
- `r-assign/lib/bigint` - for bigint values
- `r-assign/lib/boolean` - for boolean values
- `r-assign/lib/number` - for number values
- `r-assign/lib/string` - for string values
- `r-assign/lib/symbol` - for symbol values
- `r-assign/lib/null` - for null and nullable values
- `r-assign/lib/undefined` - for undefined value
- `r-assign/lib/literal` - for literal values
- `r-assign/lib/template-literal` - for template literal values

Complex Data Types:
- `r-assign/lib/array` - for array values
- `r-assign/lib/object` - for object values
- `r-assign/lib/instance` - for objects values of specific instance
- `r-assign/lib/tuple` - for tuple values
- `r-assign/lib/function` - for function values
- `r-assign/lib/date` - for date values

Type Operations
- `r-assign/lib/optional` - for optional types
- `r-assign/lib/union` - for union types
- `r-assign/lib/intersection` - for intersection of types

Transform Functions
- `r-assign/lib/get-type` - get a value of the provided type or returns the
                            default value
- `r-assign/lib/parse-type` - get a value of the provide type or throws a type
                              error

## Type guards
`r-assign` is build around the concept of type guards which are just functions
that perform a runtime check that guarantees the type of a specific value.

```js
import { isString } from 'r-assign/lib/string';

isString('abc'); // => true

isString(42); // => false
```

Some type guards require configuration to be able to do more complex type
checking.

```js
import { isArrayOf } from 'r-assign/lib/array';
import { isString } from 'r-assign/lib/string';

const isArrayOfStrings = isArrayOf(isString);

isArrayOfStrings(['abc']); // => true

isArrayOfStrings([42]); // => false
```

More type guards examples:

```js
import { isAny } from 'r-assign/lib/any';
import { isBigInt } from 'r-assign/lib/bigint';
import { isBoolean } from 'r-assign/lib/boolean';
import { isAnyDate, isDate } from 'r-assign/lib/date';
import { isNumber, isAnyNumber } from 'r-assign/lib/number';
import { isString } from 'r-assign/lib/string';
import { isSymbol } from 'r-assign/lib/symbol';
import { isNull, isNullable } from 'r-assign/lib/null';
import { isUndefined } from 'r-assign/lib/undefined';
import { isLiteral, isLiteralOf } from 'r-assign/lib/literal';
import { isArrayOf } from 'r-assign/lib/array';
import { isObjectOf, isStrictObjectOf } from 'r-assign/lib/object';
import { isInstanceOf } from 'r-assign/lib/instance';
import { isTemplateLiteralOf } from 'r-assign/lib/template-literal';
import { isTupleOf } from 'r-assign/lib/tuple';
import { isFunction } from 'r-assign/lib/function';
import { isOptional, isOptionalUndefined } from 'r-assign/lib/optional';

isAny('abc'); // => true
isAny(); // => true, will always return true

isBigInt(42n); // => true
isBoolean(false); // => true
isNumber(42); // => true
isNumber(NaN); // => false, will return true only for finite number values
isAnyNumber(NaN); // => true, will return true for any number values
isString('abc'); // => true
isSymbol(Symbol('abc')); // => true

isNull(null); // => true

// Takes as argument a type guard
const isStringOrNull = isNullable(isString);

isStringOrNull('abc'); // => true
isStringOrNull(null); // => true

isUndefined(); // => true
isUndefined(undefined); => true

// Takes as argument any primitive value or null
const isLiteralABC = isLiteral('abc');

isLiteralABC('abc'); // => true
isLiteralABC('def'); // => false

// Takes as argument an array of primitive values, at least 2 are required
const isOneOrTwo = isLiteralOf([1, 2]);

isOneOrTwo(1); // => true
isOneOrTwo(2); // => true
isOneOrTwo(3); // => false

// Takes as argument a type guard
const isArrayOfStrings = isArrayOf(isString);

isArrayOfStrings(['abc']); // => true
isArrayOfStrings(['abc',,'def']); // => false, will check for sparse arrays

// Takes as argument an object with type guards as properties
const isObjectOfNameAge = isObjectOf({
    name: isString,
    age: isNumber
});

isObjectOfNameAge({
    name: 'John',
    age: 22,
    active: true
}); // => true, checks only if the provided properties are available

// Takes as argument an object with type guards as properties
const isStrictObjectOfNameAge = isStrictObjectOf({
    name: isString,
    age: isNumber
});

isStrictObjectOfNameAge({
    name: 'John',
    age: 22,
    active: true
}); // => false, checks for the provided properties and object shape to match

// Takes as argument a class constructor
const isDateInstance = isInstanceOf(Date);

isDateInstance(new Date()); // => true

// There is also a date type guard
isDate(new Date()); // => true
isDate(new Date(NaN)); // => false, will return true only for valid date values

isAnyDate(new Date()); // => true
isAnyDate(new Date(NaN)); // => true, will return true for any date values

// Takes as argument an array of type guards
const isTupleOfStrings = isTupleOf([isString, isString]);

isTupleOfStrings(['abc', 'def']); // => true
isTupleOfStrings(['abc']); // => false

// Takes as argument an array of type guards and literal values
const isStringNumberDashed = isTemplateLiteralOf([isString, '-', isNumber]);

isStringNumberDashed('abc-123'); // => true
isStringNumberDashed('abc'); // => false

// Takes two arguments, the function arguments tuple type guards and function
// return type guard
const isStringFunction = isFunction([], isString);

isStringFunction(() => null); // => true, will check just if the provided value
                              //    is a function
isStringFunction(() => ''); // => true

// Note: Function type guards should be used as part of parsing or getting
//       values to validate the function arguments and return type, in other
//       cases they will just check for function type

// Takes as argument a type guard
const isOptionalString = isOptional(isString);

isOptionalString('abc'); // => true
isOptionalString(); // => true, will return true for string or undefined values

// Works like "isOptional()" type guard but has a different semantic when used
// in object or tuple type guards
const isOptUndefString = isOptionalUndefined(isString);

isOptUndefString('abc'); // => true
isOptUndefString(); // => true, will return true for string or undefined values

// Note: Optional type guards should be used as part of object or tuple type
//       guards, they do not have a specific semantic by themselves

const isTupleOfOptionalStrings = isTupleOf([isString, isOptional(isString)]);

isTupleOfOptionalStrings(['abc', 'def']); // => true
isTupleOfOptionalStrings(['abc']); // => true
isTupleOfOptionalStrings(['abc', undefined]); // => false

const isTupleOfOptionalStrings2 = isTupleOf([
    isString,
    isOptionalUndefined(isString)
]);

isTupleOfOptionalStrings2(['abc', 'def']); // => true
isTupleOfOptionalStrings2(['abc']); // => true
isTupleOfOptionalStrings2(['abc', undefined]); // => true

const isObjectOfNameOptionalAge = isObjectOf({
    name: isString,
    age: isOptional(isNumber)
});

isObjectOfNameOptionalAge({
    name: 'John',
    age: 22,
}); // => true

isObjectOfNameOptionalAge({
    name: 'John'
}); // => true

isObjectOfNameOptionalAge({
    name: 'John',
    age: undefined
}); // => false

const isObjectOfNameOptionalAge2 = isObjectOf({
    name: isString,
    age: isOptionalUndefined(isNumber)
});

isObjectOfNameOptionalAge2({
    name: 'John',
    age: 22,
}); // => true

isObjectOfNameOptionalAge2({
    name: 'John'
}); // => true

isObjectOfNameOptionalAge2({
    name: 'John',
    age: undefined
}); // => true
```

## Union and intersection type guards
Union and intersection type guards are used to combine multiple type guards (at
least two) into more complex type guards. For union type guard to return true
only one of the provided type guards must return true. For intersection type
guard to return true all of the provided type guards must return true. `isAny()`
or `isOptional()` type guards are not allowed to be used in union or
intersection type guards.

```js
import { isBoolean } from 'r-assign/lib/boolean';
import { isNumber } from 'r-assign/lib/number';
import { isObjectOf } from 'r-assign/lib/object';
import { isString } from 'r-assign/lib/string';
import { isUnionOf } from 'r-assign/lib/union';
import { isIntersectionOf } from 'r-assign/lib/intersection';

// Takes as argument an array of type guards, at least 2 are required
const isStringOrNumber = isUnionOf([isString, isNumber]);

isStringOrNumber('abc'); // => true
isStringOrNumber(42); // => true, will return true for string or number values

const isStringOrBoolean = isUnionOf([isString, isBoolean]);

isStringOrBoolean('abc'); // => true
isStringOrBoolean(false); // => true, will return true for string or boolean values

const isStringButWhy = isIntersectionOf([isStringOrNumber, isStringOrBoolean]);

isStringButWhy('abc'); // => true
isStringButWhy(42); // => false
isStringButWhy(false); // => false, will return false for other but string values

const isObjectOfNameAge = isObjectOf({
    name: isString,
    age: isNumber
});

const isObjectOfActive = isObjectOf({
    active: isBoolean
});

const isObjectOfNameAgeActive = isIntersectionOf([
    isObjectOfNameAge,
    isObjectOfActive
]);

isObjectOfNameAgeActive({
    name: 'John',
    age: 22,
    active: true
}); // => true, will return true for merged objects type guard
```

## Parsing data
`r-assign` allows parsing provided values, it will validate them based on the
defined schemas, will throw an error in case they do not match or just return
the value in case they match. The array and object parsing returns a deep
clone of the input values, for function values will return a function wrap that
will validate the input and the output on function call.

```js
import rAssign from 'r-assign';
import { parseType } from 'r-assign/lib/parse-type';
import { isString } from 'r-assign/lib/string';

try {
    const result = rAssign({
        data: parseType(isString)
    }, { /* Unknown data */ });
} catch (error) {
    /* Process error */
}
```

`parseType()` function has to be used with the `rAssign` function for commodity
and can be configured with type guards for more complex parsing. For proper
usage parsing utility functions should be wrapped inside a `try...catch`
statement.

## Getting data
Getting data in `r-assign` is very similar with parsing data with the exception
that getting utility functions accepts default values in case the input is not
the defined type.

```js
import rAssign from 'r-assign';
import { getType } from 'r-assign/lib/get-type';
import { isString } from 'r-assign/lib/string';

const result = rAssign({
    data: getType(isString, 'abc') // Default value will be "abc"
}, { /* Unknown data */ });
```

## Converting data to strings and dates
When there is a variety of data types that can be converted to string or date
types, `r-assign` provides utility functions for that purpose using the
following functions:
- `convertToString` - converts any value to string, will NOT stringify objects
  to JSON, it behaves exactly as calling `.toString()` method on the provided
  values.
- `convertToDate` - converts any string or number to date, will throw an error
  if the provided value is not a valid date, it behaves exactly as calling the
  `new Date()` constructor on the provided values.
- `convertToAnyDate` - converts any string or number to date, will throw an
  error if the provided value is not convertible to date, it behaves exactly as
  calling the `new Date()` constructor on the provided values.

```js
import rAssign from 'r-assign';
import { convertToAnyDate, convertToDate } from 'r-assign/lib/date';
import { convertToString } from 'r-assign/lib/string';

const input = {
    created: '2020-01-01',
    edited: 1609459200000,
    status: null
};

const result = rAssign({
    created: convertToDate,
    edited: convertToAnyDate,
    status: convertToString
}, input);

// {
//     created: new Date('2020-01-01'),
//     edited: new Date('2021-01-01'),
//     status: 'null'
// }
```

## Working with TypeScript
`r-assign` is designed to be used in both JavaScript and TypeScript projects.
The output of the `rAssign` function is automatically inferred, it is also
possible to infer a type out of the provided schema using the `InferType` type
that is exported from the package. In the case of a type guard the type
`InferTypeGuard` should be used, it is exported from `r-assign/lib`.

```ts
import rAssign, { InferType } from 'r-assign';
import {
    isBoolean,
    isNumber,
    isObjectOf,
    isOptional,
    isString,
    getType,
    parseType,
    InferTypeGuard
} from 'r-assign/lib';

const personSchema = {
    name: parseType(isString),
    age: getType(isNumber, 0),
    active: getType(isOptional(isBoolean), false)
};

const result = rAssign(personSchema, { /* Unknown data */ });

// {
//     name: string;
//     age: number;
//     active?: boolean;
// };

type PersonType = InferType<typeof personSchema>;

// type PersonType = {
//     name: string;
//     age: number;
//     active?: boolean;
// };

// Or use a type guard and infer the type from it
const isPerson = isObjectOf({
    name: isString,
    age: isNumber,
    active: isOptional(isBoolean)
});

type PersonType = InferTypeGuard<typeof isPerson>;

// type PersonType = {
//     name: string;
//     age: number;
//     active?: boolean;
// };
```

## Mapping properties
One of the main features of `r-assign` is to map values, utility functions can
be combined to implement this functional.

```js
import rAssign from 'r-assign';
import { isNumber, getType } from 'r-assign/lib';

const getFiniteNumber = getType(isNumber, 0);

const incrementNumber = (value) => {

    const number = getFiniteNumber(value);

    return number + 1;
};

const result = rAssign({
    value: incrementNumber
}, { /* Unknown data */ });
```

## Filtering properties
Filtering properties in `r-assign` is a side effect of the thing that only
properties that are defined inside transform schema are added to the output
object. Another use case of filtering would be to accept some values for a
properties and reject other.

As a simple example let's exclude the number `42` from the accepted values:

```js
import rAssign from 'r-assign';
import { isNumber, getType } from 'r-assign/lib';

const getFiniteNumber = getType(isNumber, 0);

const acceptNumbersExcept42 = (value) => {

    const number = getFiniteNumber(value);

    if (number === 42) {
        return undefined;
    }

    return number;
};

const result = rAssign({
    value: acceptNumbersExcept42
}, { /* Unknown data */ });
```

## Complex interactions
By design `r-assign` can interact with multiple properties and create new ones
using the source object that is accessed as the third argument in transform
functions.

As a simples example let's get a `port` value with multiple conditions, in case
there is set another property in the source object like `https` set to `true`.

```js
import rAssign from 'r-assign';
import { isNumber, getType } from 'r-assign/lib';

const httpDefaultPort = 80;
const httpsDefaultPort = 443;
const lastReservedPort = 1023;
const getFiniteNumber = getType(isNumber, httpDefaultPort);

const getPort = (value, key, source) => {

    const port = getFiniteNumber(value);

    if (port > lastReservedPort) {
        return port;
    }

    if (source.https === true) {
        return httpsDefaultPort;
    }

    return httpDefaultPort;
};

const result = rAssign({
    port: getPort
}, { /* Unknown data */ });
```