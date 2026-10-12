import type { CoreLessInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreLessInstruction extends CoreTyped<CoreLessInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const less: CoreInstructionHandler<CoreLessInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) < Number(evaluate(event, right, response));
