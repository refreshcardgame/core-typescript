import type { CoreResponseInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import { CorePlayer } from "../player.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreResponseInstruction extends CoreTyped<CoreResponseInstructionType> {
  player: CoreInstructionOrLiteral;
  field: CoreInstructionOrLiteral;
  index: CoreInstructionOrLiteral;
}

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
