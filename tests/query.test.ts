import "dotenv/config";

import { Deta, z } from "../src";

test("test basic query functionality", async () => {
  const base = Deta().TypedBase(
    "resultTesting",
    z.object({
      number: z.number(),
    })
  );

  function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const putRecords = await base.putMany(
    Array.from({ length: 25 }).map(() => ({ number: getRndInteger(0, 20) })),
    { expireIn: 5000 }
  );

  const filteredRecords = putRecords.processed.items.filter(
    (record) => record.number >= 5 && record.number <= 10
  );

  const fetchedRecords = await base.fetch({
    "number?r": [5, 10],
  });

  expect(filteredRecords.length).toBe(fetchedRecords.count);

  const deletes = putRecords.processed.items.map((record) =>
    base.delete(record.key)
  );

  await Promise.all(deletes);
});

test("Make sure autoPaginate works", async () => {
  const base = Deta().TypedBase(
    "paginationTesting",
    z.object({
      x: z.number(),
    })
  );

  const response = await base.fetch(undefined, { autoPaginate: true });

  if (response.count == 0)
    console.log("Zero results found, make sure you've run create-test-data.js");

  expect(response.count).toBe(5000);
}, 7_000);
