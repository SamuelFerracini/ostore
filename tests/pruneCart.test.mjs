import test from "node:test";
import assert from "node:assert/strict";
import { pruneMissingProducts } from "../app/composables/pruneCart.js";

const index = { shopA: { cat: [{ id: "1" }, { id: "2" }] }, shopB: { cat: [{ id: "3" }] } };

test("drops unknown ids", () => {
  const out = pruneMissingProducts([{ id: "1" }, { id: "99" }], index);
  assert.deepEqual(out, [{ id: "1" }]);
});

test("number id matches string id in index", () => {
  const out = pruneMissingProducts([{ id: 3 }], index);
  assert.deepEqual(out, [{ id: 3 }]);
});

test("empty index removes everything", () => {
  assert.deepEqual(pruneMissingProducts([{ id: "1" }], {}), []);
});
