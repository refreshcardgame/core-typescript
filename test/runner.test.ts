import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { validateResponse } from "../src/index.ts";

void suite("validateResponse", () => {
  const request = {
    p1: { action: { min: 1, max: 2, options: ["draw", "play", "pass"] } },
    p2: { action: { min: 1, max: 1, options: ["draw", "play"] } },
  };

  void test("accepts valid responses within range", () => {
    assert.equal(validateResponse(request, { p1: { action: [0, 2] }, p2: { action: [1] } }), true);
  });

  void test("rejects responses with too many selections", () => {
    assert.equal(
      validateResponse(request, { p1: { action: [0, 2, 1] }, p2: { action: [1] } }),
      false,
    );
  });

  void test("rejects responses with invalid option counts for a player", () => {
    assert.equal(validateResponse(request, { p1: { action: [0] }, p2: { action: [0, 1] } }), false);
  });

  void test("rejects responses with out-of-range option indices", () => {
    assert.equal(validateResponse(request, { p1: { action: [0] }, p2: { action: [2] } }), false);
  });

  void test("rejects responses missing a player field", () => {
    assert.equal(validateResponse(request, { p1: { action: [0] } }), false);
  });

  void test("rejects responses below the minimum required selections", () => {
    assert.equal(validateResponse(request, { p1: { action: [] }, p2: { action: [1] } }), false);
  });
});
