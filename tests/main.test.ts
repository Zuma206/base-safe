import "dotenv/config";

import { Deta, z } from "../src";

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
