require("dotenv").config();
const { Deta } = require("deta");

(async () => {
  const base = Deta().Base("paginationTesting");

  for (const _ of Array.from({ length: 5000 / 25 })) {
    const records = Array.from({ length: 25 }).map(() => ({ x: 0 }));
    await base.putMany(records);
  }

  console.log("Created test data");
})();
