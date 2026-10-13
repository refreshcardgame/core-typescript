import { Type } from "typebox";
import { CoreResponseInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CorePlayer } from "../player.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicResponseInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreResponseInstructionType])],
  {
    player: CoreCyclicInstructionOrLiteralRef,
    field: CoreCyclicInstructionOrLiteralRef,
    index: CoreCyclicInstructionOrLiteralRef,
  },
);
export const CoreResponseInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicResponseInstruction",
);
export type CoreResponseInstruction = Type.Static<typeof CoreResponseInstruction>;

export const response: CoreInstructionHandler<CoreResponseInstruction> = (
  event,
  { field, index, player },
  response,
) => {
  const evaluated = evaluate(event, player, response);
  return response?.[evaluated instanceof CorePlayer ? evaluated.id : String(evaluated)]?.[
    String(evaluate(event, field, response))
  ]?.[Number(evaluate(event, index, response))];
};
