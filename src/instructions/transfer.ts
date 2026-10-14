import { Type } from "typebox";
import { CoreTransferInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { isDestinationData } from "../position.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicTransferInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreTransferInstructionType])],
  { destinations: Type.Ref("CoreCyclicInstruction") },
);
export const CoreTransferInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicTransferInstruction",
);
export type CoreTransferInstruction = Type.Static<typeof CoreTransferInstruction>;

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
