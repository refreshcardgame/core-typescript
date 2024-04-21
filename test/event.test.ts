import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { CoreEvent, CoreGame, wrapResult } from "../src/index.ts";

function createGame() {
  return new CoreGame({
    state: {
      dimensions: 1,
      players: {
        p1: { id: "p1", starting: { characters: [], deck: [], extra: [] } },
        p2: { id: "p2", starting: { characters: [], deck: [], extra: [] } },
      },
    },
  }).start();
}

void suite("event.priority", () => {
  void test("rotates priority through players and ends when all have passed", () => {
    const game = createGame();

    const event = new CoreEvent(game, { name: "priority", phase: "before" });

    const first = event.trigger([], {});
    assert.deepEqual(first, wrapResult());
    assert.equal(event.priority.pointer, game.state.order.at(0));

    const second = event.trigger([], {});
    assert.deepEqual(second, wrapResult());
    assert.equal(event.priority.pointer, game.state.order.at(1));
    assert.deepEqual(event.priority.passed.values().toArray(), [game.state.order.at(0)]);

    const third = event.trigger([], {});
    assert.deepEqual(third, wrapResult(true));
    assert.equal(event.priority.pointer, void 0);
    assert.deepEqual(event.priority.passed.values().toArray(), []);
  });
});
