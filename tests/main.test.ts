import "dotenv/config";

import { Deta, z } from "../src";
import { Action, ActionTypes } from "../src/action";

test("Ensure create, read, delete works correctly", async () => {
  const base = Deta().SchemaBase(
    "test-basr",
    z.object({
      profile: z.object({
        username: z.string(),
        profilePicture: z.string(),
        age: z.number(),
      }),
      connections: z.object({
        friends: z.array(z.string()),
        blocked: z.array(z.string()),
      }),
    })
  );

  const key = "user0";
  const user = await base.put(
    {
      profile: {
        username: "Zuma",
        age: 17,
        profilePicture: "https://thing.com/pfp.png",
      },
      connections: {
        friends: [],
        blocked: [],
      },
    },
    key
  );

  expect(user).not.toBe(null);
  if (!user) return;

  const fetchedUser = await base.get(key);
  expect(fetchedUser).toMatchObject(user);

  const response = await base.delete(key);

  expect(response).toBeNull();
});

test("Check input is being validated", async () => {
  const base = Deta().SchemaBase(
    "test-basr",
    z.object({
      username: z.string().min(3).max(16),
    })
  );

  expect(() => {
    base.put({
      username: "Aa",
    });
  }).toThrowError(z.ZodError);
});

test("Make sure updates work properly", async () => {
  {
    const base = Deta().SchemaBase(
      "test-basr",
      z.object({ number: z.number() })
    );

    const key = "number0";
    const record = await base.put({ number: 0 }, key);

    expect(record).not.toBeNull();
    if (!record) return;

    record.number++;
    await base.update(
      {
        number: base.util.increment(1),
      },
      key
    );
    const updatedRecord = await base.get(key);

    expect(updatedRecord).toMatchObject(record);
  }

  {
    const base = Deta().SchemaBase(
      "test-basr",
      z.object({ friends: z.array(z.string()) })
    );

    const user = await base.put({ friends: [] });

    expect(user).not.toBeNull();
    if (!user) return;

    await base.update(
      {
        friends: base.util.append("friend98234"),
      },
      user.key
    );

    const newUser = await base.get(user.key);
    expect(newUser).toMatchObject({ friends: ["friend98234"] });
  }
});
