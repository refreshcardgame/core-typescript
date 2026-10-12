import type { CoreDrawInstructionType } from "../constants/instruction.ts";
import { CORE_HAND_ZONE } from "../constants/position.ts";
import {
  evaluate,
  type CoreInstruction,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import { takeRight } from "../iterator.ts";
import { CorePlayer } from "../player.ts";
import type { CoreDestination } from "../position.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreSingleDrawInstruction extends CoreTyped<CoreDrawInstructionType> {
  player: CoreInstruction;
  count: CoreInstructionOrLiteral;
}

export interface CoreMultipleDrawInstruction extends CoreTyped<CoreDrawInstructionType> {
  players: CoreInstruction;
  each?: CoreInstructionOrLiteral;
  count: CoreInstructionOrLiteral;
}

export type CoreDrawInstruction = CoreMultipleDrawInstruction | CoreSingleDrawInstruction;

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
