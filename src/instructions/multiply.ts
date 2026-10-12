import type { CoreMultiplyInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreMultiplyInstruction extends CoreTyped<CoreMultiplyInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const multiply: CoreInstructionHandler<CoreMultiplyInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) * Number(evaluate(event, right, response));
