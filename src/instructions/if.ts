import type { CoreIfInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreIfInstruction extends CoreTyped<CoreIfInstructionType> {
  condition: CoreInstructionOrLiteral;
  then: CoreInstructionOrLiteral;
  else?: CoreInstructionOrLiteral;
}

export const ifHandler: CoreInstructionHandler<CoreIfInstruction> = (
  event,
  { condition, then: thenInstruction, else: elseInstruction },
  response,
) => {
  if (evaluate(event, condition, response)) return evaluate(event, thenInstruction, response);
  if (typeof elseInstruction !== "undefined") return evaluate(event, elseInstruction, response);
};
