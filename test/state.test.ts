import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { CoreGame, CoreObject, CoreTuple } from "../src/index.ts";

void suite("CoreState.addField", () => {
  void test("inserts objects into the field according to the requested layer", () => {
    const game = new CoreGame({
      state: {
        dimensions: 1,
        players: {
          p1: {
            id: "p1",
            starting: { characters: [], deck: [], extra: [] },
          },
          p2: {
            id: "p2",
            starting: { characters: [], deck: [], extra: [] },
          },
        },
      },
    });

    const a = new CoreObject(game, { id: "a", name: "alpha" });
    const b = new CoreObject(game, { id: "b", name: "beta" });
    const c = new CoreObject(game, { id: "c", name: "gamma" });
    const d = new CoreObject(game, { id: "d", name: "delta" });
    const coordinates = new CoreTuple(0);

    game.state.setObject(a);
    game.state.setObject(b);
    game.state.setObject(c);
    game.state.setObject(d);

    game.state.inField(a, { coordinates, direction: "north" });
    game.state.inField(b, { coordinates, direction: "north" }, { side: "after" });
    game.state.inField(c, { coordinates, direction: "north" }, { side: "before", target: a });
    game.state.inField(d, { coordinates, direction: "north" }, { side: "after", target: a });

    assert.deepEqual(
      game.state.getField(coordinates).map(({ id }) => id),
      ["c", "a", "d", "b"],
    );

    const field = game.state.field.get(coordinates.toString());
    assert.ok(field);
    assert.deepEqual(field.toArray(), ["c", "a", "d", "b"]);
  });
});
