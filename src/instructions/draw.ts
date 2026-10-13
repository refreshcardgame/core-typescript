import { Type } from "typebox";
import { CoreDrawInstructionType } from "../constants/instruction.ts";
import { CORE_HAND_ZONE } from "../constants/position.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreCyclicInstructionRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { takeRight } from "../iterator.ts";
import { CorePlayer } from "../player.ts";
import type { CoreDestination } from "../position.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicSingleDrawInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreDrawInstructionType])],
  { player: CoreCyclicInstructionRef, count: CoreCyclicInstructionOrLiteralRef },
);
export const CoreSingleDrawInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicSingleDrawInstruction",
);
export const CoreCyclicMultipleDrawInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreDrawInstructionType])],
  {
    players: CoreCyclicInstructionRef,
    each: Type.Optional(CoreCyclicInstructionOrLiteralRef),
    count: CoreCyclicInstructionOrLiteralRef,
  },
);
export const CoreMultipleDrawInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicMultipleDrawInstruction",
);
export const CoreDrawInstruction = Type.Union([
  CoreSingleDrawInstruction,
  CoreMultipleDrawInstruction,
]);
export type CoreDrawInstruction = Type.Static<typeof CoreDrawInstruction>;

export const draw: CoreInstructionHandler<CoreDrawInstruction> = (event, instruction, response) => {
  if ("player" in instruction) {
    const evaluatedPlayer = evaluate(event, instruction.player, response);
    return (
      evaluatedPlayer instanceof CorePlayer &&
      event.game.transfer([
        {
          objects: event.game.state.getObjects(
            takeRight(evaluatedPlayer.deck, Number(evaluate(event, instruction.count, response))),
          ),
          position: { zone: CORE_HAND_ZONE, player: evaluatedPlayer },
        },
      ])
    );
  }

  const evaluatedPlayers = evaluate(event, instruction.players, response);
  if (!Array.isArray(evaluatedPlayers)) return;
  const destinations: CoreDestination[] = [];

  if (typeof instruction.each === "undefined")
    for (const player of evaluatedPlayers.filter((player) => player instanceof CorePlayer)) {
      destinations.push({
        objects: event.game.state.getObjects(
          takeRight(player.deck, Number(evaluate(event, instruction.count, response))),
        ),
        position: { zone: CORE_HAND_ZONE, player },
      });
    }
  else {
    const name = String(evaluate(event, instruction.each, response));
    const previous = event.getVariable(name);

    for (const player of evaluatedPlayers.filter((player) => player instanceof CorePlayer)) {
      event.setVariable(name, player);
      destinations.push({
        objects: event.game.state.getObjects(
          takeRight(player.deck, Number(evaluate(event, instruction.count, response))),
        ),
        position: { zone: CORE_HAND_ZONE, player },
      });
    }

    event.setVariable(name, previous);
  }

  return event.game.transfer(destinations);
};
