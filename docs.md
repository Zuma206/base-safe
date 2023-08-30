# Base Safe - Documentation

Before going any further, please familiarise yourself with Deta's [official SDK documentation](https://deta.space/docs/en/build/reference/http-api/base), as I will only be documenting differences between Base Safe and the official SDK.

## Inclusion of Zod

Base safe includes a full copy of Zod that's used internally. You can access it from the top level of the module if you do not wish to install it separately:

```ts
import { z } from "base-safe";

// All of zod is available
const schema = z.object({ name: z.string() });
```

## DetaClass & TypedBase

`DetaClass` is almost identical to the official SDK's `DetaClass`, but with the extra `TypedBase` method that allows the initialization of the `TypedBase` class.

Example:

```ts
import { Deta as OfficialDeta } from "deta";
import { Deta as BaseSafeDeta } from "base-safe";

const officialDeta = OfficialDeta();
const baseSafeDeta = BaseSafeDeta();

officialDeta.TypedBase; // undefined
baseSafeDeta.TypedBase; // Function
```

The `TypedBase` class takes a few extra parameters when it's initialized. Those being the zod schema, and a boolean to set whether validation is necessary.

Examples:

```ts
const officialUsers = officialDeta.Base("users", ...otherOfficialSettings);

const baseSafeUsers = baseSafeDeta.Base(
  "users",
  z.object({
    name: z.string(),
    password: z.string(),
  }), // The zod schema to validate and case with
  false, // Disable (or enable with `true`) validation in
  ...otherOfficialSettings
);
```

## Rules of typing

When creating Base Safe, I added a few rules for typing that make things predictable.

### 1. Base Schemas cannot override reserved columns

Inside Deta Base, there are two reserved keys, `key` & `__expires`. Both of these can be set in Base Safe outside of the main object. Here's an example:

```ts
await usersBase.put({ name: "Zuma" }, "key123", {
  //                                  ^ `key` will be "key123"
  expiresAt: new Date(1693415669863),
  //         ^ `__expires` will be the Unix timestamp of this `Date` object
});
```

Here are the repercussions:

```ts
import { Deta, z } from "base-safe";

const sdk = Deta();

// Typescript error:
const users = sdk.TypedBase(
  "users",
  z.object({
    key: z.string(),
  })
);

// Typescript error:
const users = sdk.TypedBase(
  "users",
  z.object({
    __expires: z.number(),
  })
);
```

These keys will automatically be added to the response of any methods that return rows. Here's an example:

```ts
const user = await users.get("user0");
if (!user) throw Error(); // Assuming the key exists
user.key; // typeof string
user.__expires; // typeof number|undefined
```

### 2. Parse in, cast out

Base Safe assumes that you've been using the current schema for the whole of the app's existence. Therefore, validation will never occur on objects coming out of the base. This is mainly a performance choice, as validating thousands of results returned from `fetch` would not be efficient.

Examples:

```ts
// (all runtime errors are subject to validation being set to true)

// No runtime or typescript errors
await users.put(objectThatFitsSchemaAndType);
// Runtime error and typescript error
await users.put(objectThatDoesntFitSchemaOrType);
// Just runtime error (example: string has incorrect length)
await users.put(objectThatDoesntFitSchema);
```

```ts
const user = await users.get("user");
console.log(user.name);
/*
Assuming that `user` is not null (the key exists), then the typescript types would state that `user.name` is a string. However, if the record was added through the Deta Base UI, or the official Deta Base SDK, then it could be anything.
*/
```

## Extra Feature(s)

Currently, Base-Safe only has 1 extra feature (aside from schemas) that the official SDK doesn't. That being auto-pagination. A fundamental limitation of Deta Base is that each query will stop after 1000 keys have been searched. To work around this, you can use Base Safe's `autoPagination` option. It should be noted that this option will send multiple requests until either the limit or the end of the base, is reached.

Example:

```ts
const query0 = await users.fetch(undefined, { limit: 10 });
query0.count; // Up to 10, via 1 request

const query1 = await users.fetch(undefined);
query1.count; // Up to 1000, via 1 request

const query2 = await users.fetch(undefined, { limit: 2000 });
query2.count; // Up to 1000, via 1 request

const query3 = await users.fetch(undefined, {
  autoPaginate: true,
  limit: 2000,
});
query3.count; // Up to 2000, via up to 2 requests

const query4 = await users.fetch(undefined, {
  autoPaginate: true,
  limit: 3500,
});
query4.count; // Up to 3500, via up to 4 requests

const query5 = await users.fetch(undefined, {
  autoPaginate: true,
});
query5.count; // No limit, with no limit on requests
```
