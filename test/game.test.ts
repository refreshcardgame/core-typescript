import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { CoreGame, wrapResult } from "../src/index.ts";

function createGame() {
  return new CoreGame({
    state: {
      dimensions: 1,
      players: {
        p1: {
          id: "p1",
          starting: {
            characters: [0],
            deck: ["core:basicCharacter", "core:basicCharacter", "core:basicCharacter"],
            extra: ["core:basicCharacter"],
          },
        },
        p2: {
          id: "p2",
          starting: {
            characters: [0],
            deck: ["core:basicCharacter", "core:basicCharacter", "core:basicCharacter"],
            extra: ["core:basicCharacter"],
          },
        },
      },
    },
  }).start();
}

void suite("game.start", () => {
  void test("initializes each player's starting characters", () => {
    const game = createGame();

    const p1 = game.state.getPlayer("p1");
    const p2 = game.state.getPlayer("p2");

    assert.ok(p1);
    assert.ok(p2);
    assert.equal(p1.characters.length, 1);
    assert.equal(p2.characters.length, 1);
    assert.ok(p1.getMainCharacter());
    assert.ok(p2.getMainCharacter());
    assert.equal(p1.getMainCharacter()?.name, "core:basicCharacter");
    assert.equal(p2.getMainCharacter()?.name, "core:basicCharacter");
  });
});

void suite("game.next", () => {
  void test("advances the initial event after game.start()", () => {
    const game = createGame();

    assert.equal(game.state.started, true);
    assert.equal(game.state.getCurrentEvent()?.name, "initial");

    const first = game.next();
    assert.deepEqual(first, wrapResult());
    assert.equal(game.state.getCurrentEvent()?.name, "initial");

    const second = game.next();
    assert.deepEqual(second, wrapResult());
    assert.equal(game.state.getCurrentEvent()?.name, "initial");
  });

  void test("eventually reaches a player's end phase after repeated calls", () => {
    const game = createGame();

    let reachedEndPhase = false;

    for (let count = 0; count < 100; count++) {
      game.next();

      if (game.state.getCurrentEvent()?.name === "endPhase") {
        reachedEndPhase = true;
        break;
      }
    }

    assert.equal(reachedEndPhase, true);
    assert.equal(game.state.getCurrentEvent()?.getPlayer(), game.state.getTurnPointer());
  });
});
