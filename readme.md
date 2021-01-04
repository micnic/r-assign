# r-assign

[![npm version](https://img.shields.io/npm/v/r-assign.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/r-assign)
[![npm downloads](https://img.shields.io/npm/dm/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
[![npm types](https://img.shields.io/npm/types/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
[![node version](https://img.shields.io/node/v/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)
[![license](https://img.shields.io/npm/l/r-assign.svg?style=flat-square)](https://www.npmjs.com/package/r-assign)

`Object.assign()` with a transform feature for filtering and mapping object
properties.

## Install

`npm i r-assign`

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
type TransformSchema = {
    [key: string]: (value: any, key: string, source: any) => any;
};

rAssign(schema: TransformSchema, ...sources: any[]): any;

// Note: The actual TypeScript definition is a bit more complex, here is
//       displayed a simplified one for a easier understanding of the function
//       signature and schema structure.
```

`r-assign` exports a function that accepts a `schema` object as the first
argument that defines the structure of the result by merging and transforming of
any `source` objects provided as the next arguments.

The `schema` argument is an user-defined object with properties as functions
that return a value based on the provided input from 3 arguments: the `value`
from the source, the `key` of the value and the `source` itself. The returned
value from the function will be part of the resulting object, If the returned
value is `undefined` then the property is skipped and will not appear in the
resulting object. If any of the of the functions from the `schema` throw the
`r-assign` function will also throw.

Note: This package does not include any pre-made transform functions, users have
to define themselves and use them. This is valid at least for the initial
release, based on users feedback pre-made transform functions might be added in
future releases.

<img src="diagram.svg"/>

## Examples

```js
// Let's create some objects to work with
const fullEntry = {
    id: '5cdb44a49539f8cd',
    index: 0,
    visible: true,
    name: 'abc'
};

const partialEntry = {
    id: 'da9c8dff96b060a9',
    index: 1,
    name: 'def'
};

const invalidEntry = {
    id: '8a4eebf45748c8a4',
    index: false,
    name: 'ghi'
};

// Let's create some functions that will define the constraints for the schema
const getBoolean = (value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return false;
};

const getNumber = (value) => {
    if (typeof value === 'number') {
        return value;
    }

    return 0;
};

const getString = (value) => {
    if (typeof value === 'string') {
        return value;
    }

    return '';
};

const addOne = (value) => {
    return getNumber(value) + 1;
};

const skipOne = (value) => {
    const result = getNumber(value);

    // If undefined is returned the property isn't added to the resulting object
    if (result === 1) {
        return undefined;
    }

    return result;
};

const validateNumber = (value) => {

    if (typeof value !== 'number') {
        throw new Error('Value expected to be a number');
    }

    return value;
};

// Now let's see the proper usage examples

// Select only specific properties from object
rAssign({
    id: getString,
    index: getNumber,
    name: getString
}, fullEntry);
// => {
//      id: '5cdb44a49539f8cd',
//      index: 0,
//      // "visible" property is missing because it is not part of the schema
//      name: 'abc'
//    }

// Merge objects and select only specific properties from resulting object
rAssign({
    id: getString,
    visible: getBoolean,
    name: getString
}, fullEntry, partialEntry);
// => {
//      id: 'da9c8dff96b060a9', // from "partialEntry" object
//      // "index" property is missing because it is not part of the schema
//      visible: true, // from "fullEntry" object
//      name: 'def' // from "partialEntry" object
//    }

// Merge objects, select properties and add one to the "index" property
rAssign({
    id: getString,
    index: addOne,
    name: getString
}, fullEntry, partialEntry);
// => {
//      id: 'da9c8dff96b060a9', // from "partialEntry" object
//      index: 2, // "index" property from "partialEntry" object incremented
//      // "visible" property is missing because it is not part of the schema
//      name: 'def' // from "partialEntry" object
//    }

// Merge objects, select properties and skip one value in "index" property
rAssign({
    id: getString,
    index: skipOne,
    visible: getBoolean,
    name: getString
}, fullEntry, partialEntry);
// => {
//      id: 'da9c8dff96b060a9', // from "partialEntry" object
//      // "index" property is missing because it is skipped because it is "1"
//      visible: true, // from "fullEntry" object
//      name: 'def' // from "partialEntry" object
//    }

// Create an object with default values when an empty object is provided
rAssign({
    id: getString,
    index: getNumber,
    visible: getBoolean,
    name: getString
}, {});
// => {
//      id: '', // default string value
//      index: 0, // default number value
//      visible: false, // default boolean value
//      name: '' // default string value
//    }

// Validate a property and throw an error if constraint is not satisfied
rAssign({
    id: getString,
    index: validateNumber,
    visible: getBoolean,
    name: getString
}, invalidEntry);
// => Error: Value expected to be a number
```