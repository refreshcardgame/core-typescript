import type { CoreTransferInstructionType } from "../constants/instruction.ts";
import { evaluate, type CoreInstruction, type CoreInstructionHandler } from "../instruction.ts";
import { isDestinationData } from "../position.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreTransferInstruction extends CoreTyped<CoreTransferInstructionType> {
  destinations: CoreInstruction;
}

export const transfer: CoreInstructionHandler<CoreTransferInstruction> = (
  event,
  { destinations },
  response,
) => {
  const evaluated = evaluate(event, destinations, response);
  if (!Array.isArray(evaluated)) return 0;
  let count = 0;

  for (const { objects, position, index } of evaluated
    .filter(isDestinationData)
    .map((data) => event.game.state.toDestination(data))
    .filter((destination) => !!destination)) {
    count += event.game.state.transfer(objects, position, index);
  }

  return count;
};
