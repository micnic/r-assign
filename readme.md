# r-assign

[![npm version](https://img.shields.io/npm/v/r-assign.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/r-assign)
[![npm downloads](https://img.shields.io/npm/dm/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
[![npm types](https://img.shields.io/npm/types/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
[![node version](https://img.shields.io/node/v/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
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
- Helpful at preventing undesired values (like `NaN` when working with numbers)

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

To take advantage of all TypeScript features in `r-assign` use latest versions
and configure the TypeScript compiler with `strict` mode enabled.

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
import { getString } from 'r-assign/lib/string';

const someUnknownObject = { /* ... any structure here ... */ };

const objectABC = rAssign({
    abc: getString('abc') // Will return a string or the default value of "abc"
}, someUnknownObject);
```

## Import utility functions
```js
// Import all the needed functions from "r-assign/lib" submodule
import { isString, getNumber, getString } from 'r-assign/lib';

// Or import functions from specific submodule
import { getNumber } from 'r-assign/lib/number';
import { isString, getString } from 'r-assign/lib/string';
```

All utility functions are available for importing from `r-assign/lib`. To
prevent importing all the library it is recommended to import just the specific
submodules that will be used. The list of the available submodules is the
following:

Primitives:
- `r-assign/lib/any` - for non-undefined values
- `r-assign/lib/bigint` - for BigInt values
- `r-assign/lib/boolean` - for boolean values
- `r-assign/lib/number` - for number values
- `r-assign/lib/string` - for string values
- `r-assign/lib/symbol` - for symbol values
- `r-assign/lib/literal` - for single primitive values

Complex Data Types:
- `r-assign/lib/array` - for array values
- `r-assign/lib/object` - for object values
- `r-assign/lib/instance` - for objects values of specific instance
- More complex data types planned to be added in next releases

Type Operations
- `r-assign/lib/optional` - for optional types
- `r-assign/lib/union` - for union types
- `r-assign/lib/intersection` - for intersection of types
- More type operations planned to be added in next releases

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

Every submodule has its own type guards.

```js
import { isAny } from 'r-assign/lib/any';
import { isBigInt } from 'r-assign/lib/bigint';
import { isBoolean } from 'r-assign/lib/boolean';
import { isNumber, isAnyNumber } from 'r-assign/lib/number';
import { isString } from 'r-assign/lib/string';
import { isSymbol } from 'r-assign/lib/symbol';
import { isLiteral, isLiteralOf } from 'r-assign/lib/literal';
import { isArrayOf } from 'r-assign/lib/array';
import { isObjectOf, isStrictObjectOf } from 'r-assign/lib/object';
import { isInstanceOf } from 'r-assign/lib/instance';
import { isOptional } from 'r-assign/lib/optional';
import { isUnionOf } from 'r-assign/lib/union';
import { isIntersectionOf } from 'r-assign/lib/intersection';

isAny('abc'); // => true
isAny(); // => false, will return false only for undefined values

isBigInt(42n); // => true
isBoolean(false); // => true
isNumber(NaN); // => false, will return true only for finite number values
isAnyNumber(NaN); // => true, will return true for any number values
isString('abc'); // => true
isSymbol(Symbol('abc')); // => true

// Takes as argument any primitive value or null
const isNull = isLiteral(null);

isNull(null); // => true

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
const isDate = isInstanceOf(Date);

isDate(new Date()); // => true

// Takes as argument a type guard
const isOptionalString = isOptional(isString);

isOptionalString('abc'); // => true
isOptionalString(); // => true, will return true for string or undefined values

// Takes as argument an array of type guards, at least 2 are required
const isStringOrNumber = isUnionOf([isString, isNumber]);

isStringOrNumber('abc'); // => true
isStringOrNumber(42); // => true, will return true for string or number values

// Takes as argument an array of type guards, at least 2 are required
const isObjectOfStringAndBoolean = isIntersectionOf([isObjectOf({
    s: isString
}), isObjectOf({
    b: isBoolean
})]);

isObjectOfStringAndBoolean({
    s: 'abc',
    b: true
}); // => true
```

## Parsing data
`r-assign` allows parsing provided values, it will validate them based on the
defined schemas, will throw an error in case they do not match or just return
the value in case they match. The array and object parsing return a shallow
clone of the input values.

```js
import rAssign from 'r-assign';
import { parseString } from 'r-assign/lib/string';

try {
    const result = rAssign({
        data: parseString
    }, { /* Unknown data */ });
} catch (error) {
    /* Process error */
}
```

Parsing functions have to be used with the `rAssign` function for commodity and
can be configured with type guards for more complex parsing. For proper usage
parsing utility functions should be wrapped inside a `try...catch` statement.

```js
import rAssign from 'r-assign';
import { parseAny } from 'r-assign/lib/any';
import { parseBigInt } from 'r-assign/lib/bigint';
import { parseBoolean } from 'r-assign/lib/boolean';
import { parseNumber, parseAnyNumber, isNumber } from 'r-assign/lib/number';
import { parseString, isString } from 'r-assign/lib/string';
import { parseSymbol } from 'r-assign/lib/symbol';
import { parseLiteral, parseLiteralOf } from 'r-assign/lib/literal';
import { parseArrayOf } from 'r-assign/lib/array';
import { parseObjectOf, parseStrictObjectOf, isObjectOf } from 'r-assign/lib/object';
import { parseInstanceOf } from 'r-assign/lib/instance';
import { parseOptional } from 'r-assign/lib/optional';
import { parseUnionOf } from 'r-assign/lib/union';
import { parseIntersectionOf } from 'r-assign/lib/intersection';

const result = rAssign({
    data00: parseAny, // Parse non-undefined values

    data01: parseBigInt, // Parse BigInt values
    data02: parseBoolean, // Parse boolean values
    data03: parseNumber, // Parse finite number values
    data04: parseAnyNumber, // Parse any number values
    data05: parseString, // Parse string values
    data06: parseSymbol, // Parse symbol values

    data07: parseLiteral(null), // Parse any primitive or null
    data08: parseLiteralOf([1, 2]), // Parse union of primitive values

    data09: parseArrayOf(isString), // Parse array values

    data10: parseObjectOf({
        prop: isString
    }), // Parse object of provided shape
    data11: parseStrictObjectOf({
        prop: isString
    }), // Parse strict object of provided shape

    data12: parseInstanceOf(Date), // Parse instance of provided constructor

    data13: parseOptional(isString), // Parse optional values

    data14: parseUnionOf([isString, isNumber]), // Parse union of values

    data15: parseIntersectionOf([isObjectOf({
        prop0: isString
    }), isObjectOf({
        prop1: isNumber
    })]) // Parse intersection of values
}, { /* Unknown data */ });
```

## Getting data
Getting data in `r-assign` is very similar with parsing data with the exception
that getting utility functions accepts default values in case the input is not
the defined type.

```js
import rAssign from 'r-assign';
import { getString } from 'r-assign/lib/string';

const result = rAssign({
    data: getString() // Default value will be an empty string
}, { /* Unknown data */ });

const result = rAssign({
    data: getString('abc') // Default value will be "abc"
}, { /* Unknown data */ });
```

```js
import rAssign from 'r-assign';
import { getAny } from 'r-assign/lib/any';
import { getBigInt } from 'r-assign/lib/bigint';
import { getBoolean } from 'r-assign/lib/boolean';
import { getNumber, getAnyNumber, isNumber } from 'r-assign/lib/number';
import { getString, isString } from 'r-assign/lib/string';
import { getSymbol } from 'r-assign/lib/symbol';
import { getLiteral, getLiteralOf } from 'r-assign/lib/literal';
import { getArrayOf } from 'r-assign/lib/array';
import { getObjectOf, getStrictObjectOf, isObjectOf } from 'r-assign/lib/object';
import { getInstanceOf } from 'r-assign/lib/instance';
import { getOptional } from 'r-assign/lib/optional';
import { getUnionOf } from 'r-assign/lib/union';
import { getIntersectionOf } from 'r-assign/lib/intersection';

const result = rAssign({
    data00: getAny(), // Get non-undefined values

    data01: getBigInt(42n), // Get BigInt values
    data02: getBoolean(false), // Get boolean values
    data03: getNumber(42), // Get finite number values
    data04: getAnyNumber(1), // Get any number values
    data05: getString('abc'), // Get string values
    data06: getSymbol(Symbol('abc')), // Get symbol values

    data07: getLiteral(null), // Get any primitive or null
    data08: getLiteralOf([1, 2], 1), // Get union of primitive values

    data09: getArrayOf(isString, []), // Get array values

    data10: getObjectOf({
        prop: isString
    }, { prop: 'abc' }), // Get object of provided shape
    data11: getStrictObjectOf({
        prop: isString
    }, { prop: 'abc' }), // Get strict object of provided shape

    data12: getInstanceOf(Date, new Date()), // Get instance of provided constructor

    data13: getOptional(getString('abc')), // Get optional values

    data14: getUnionOf([isString, isNumber], 'abc'), // Get union of values

    data15: getIntersectionOf([isObjectOf({
        prop0: isString
    }), isObjectOf({
        prop1: isNumber
    })], { prop0: 'abc', prop1: 42 }) // Get intersection of values
}, { /* Unknown data */ });
```

## Working with TypeScript
`r-assign` is designed to be used in both JavaScript and TypeScript projects.
The output of the `rAssign` function is automatically inferred, it is also
possible to infer a type out of the provided schema using the `InferType` type
that is exported from the package.

```ts
import rAssign, { InferType } from 'r-assign';
import { getBoolean, getNumber, getOptional, parseString } from 'r-assign/lib';

const someSchema = {
    name: parseString,
    age: getNumber(),
    active: getOptional(getBoolean())
};

type SomeSchema = InferType<typeof someSchema>;

// type SomeSchema = {
//     name: string;
//     age: number;
//     active?: boolean | undefined;
// };

const result = rAssign(someSchema, { /* Unknown data */ });

// typeof result
// {
//     name: string;
//     age: number;
//     active?: boolean | undefined;
// };
```

## Mapping properties
One of the main features of `r-assign` is to map values, utility functions can
be combined to implement this functional.

```js
import rAssign from 'r-assign';
import { getNumber } from 'r-assign/lib';

const getFiniteNumber = getNumber();

const result = rAssign({
    value: (value) => {

        const number = getFiniteNumber(value);

        return number + 1;
    }
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
import { getNumber } from 'r-assign/lib';

const getFiniteNumber = getNumber();

const result = rAssign({
    value: (value) => {

        const number = getFiniteNumber(value);

        if (number === 42) {
            return undefined;
        }

        return number;
    }
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
import { getNumber } from 'r-assign/lib';

const getFiniteNumber = getNumber();

const result = rAssign({
    port: (value, key, source) => {

        const port = getFiniteNumber(value);

        if (port > 1023) {
            return port;
        }

        if (source.https === true) {
            return 443;
        }

        return 80;
    }
}, { /* Unknown data */ });
```