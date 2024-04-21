import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { CoreEvent, CoreGame, evaluate } from "../src/index.ts";

function createTestEvent() {
  const game = new CoreGame({
    state: {
      dimensions: 1,
      players: {
        p1: { id: "p1", starting: { characters: [], deck: [], extra: [] } },
        p2: { id: "p2", starting: { characters: [], deck: [], extra: [] } },
      },
    },
  }).start();

  return { game, event: new CoreEvent(game, { name: "test" }) };
}

void suite("evaluate", () => {
  void test("returns literal values unchanged", () => {
    const { event } = createTestEvent();

    assert.equal(evaluate(event, "hello"), "hello");
    assert.equal(evaluate(event, 7), 7);
    assert.equal(evaluate(event, false), false);
  });

  void test("evaluates add and greater instructions using operands", () => {
    const { event } = createTestEvent();

    assert.equal(evaluate(event, { type: "add", left: 2, right: 3 }), 5);

    assert.equal(evaluate(event, { type: "greater", left: 6, right: 4 }), true);
  });

  void test("stores and resolves a variable from the event scope", () => {
    const { event } = createTestEvent();

    const assigned = evaluate(event, {
      type: "variable",
      name: "score",
      set: { type: "add", left: 10, right: 5 },
    });

    assert.equal(assigned, 15);
    assert.equal(event.variables.get("score"), 15);
    assert.equal(evaluate(event, { type: "variable", name: "score" }), 15);
  });

  void test("branches and loops with nested if and while instructions", () => {
    const { event } = createTestEvent();

    const branch = evaluate(event, {
      type: "if",
      condition: { type: "equal", left: 1, right: 1 },
      then: { type: "add", left: 4, right: 6 },
      else: { type: "add", left: 1, right: 2 },
    });

    assert.equal(branch, 10);

    evaluate(event, {
      type: "while",
      condition: { type: "notEqual", left: { type: "variable", name: "looped" }, right: 7 },
      do: { type: "variable", name: "looped", set: { type: "add", left: 3, right: 4 } },
    });

    assert.equal(event.variables.get("looped"), 7);
  });

  void test("resolves player and players instructions by current player and state order", () => {
    const { game, event } = createTestEvent();

    assert.equal(evaluate(event, { type: "player", index: 0 }), game.state.getPlayer(0));

    assert.equal(evaluate(event, { type: "player", index: 1 }), game.state.getPlayer(1));

    assert.deepEqual(evaluate(event, { type: "players" }), game.state.getAllPlayers());
  });

  void test("supports multi-nested instruction trees", () => {
    const { event } = createTestEvent();

    const nested = evaluate(event, {
      type: "if",
      condition: {
        type: "and",
        left: { type: "greater", left: 10, right: 5 },
        right: {
          type: "or",
          left: { type: "equal", left: 3, right: 3 },
          right: { type: "not", value: { type: "less", left: 8, right: 4 } },
        },
      },
      then: {
        type: "variable",
        name: "nested",
        set: {
          type: "add",
          left: { type: "add", left: 2, right: 3 },
          right: { type: "multiply", left: 4, right: 5 },
        },
      },
      else: 0,
    });

    assert.equal(nested, 25);
    assert.equal(event.variables.get("nested"), 25);
  });
});
