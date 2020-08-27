# strong-typeof

A pure TypeScript/JavaScript library for strongly typing at runtime.

## Usage

Install it from the [npm repository](https://www.npmjs.com/package/strong-typeof):

```console
npm install --save strong-typeof
```

Then require it in your project:

```js
const { typeOf, StrongFunction } = require('strong-typeof')
```

Package also exports as ES Module with TS definitions for use with Deno and TypeScript.

## Features

- Type-checking functions with built-in extensions for common duck-types like async and iterable.
- Extensible type-checking by registering custom types (disabled by default)
- Factory functions for creating runtime strongly type-checked function parameters

## API

See the [API documentation](https://ahuggins-nhs.github.io/strong-typeof/) for complete information.
