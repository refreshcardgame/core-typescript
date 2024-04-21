import type { CoreLessInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreLessInstruction extends CoreType<CoreLessInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const less: CoreInstructionHandler<CoreLessInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) < Number(evaluate(event, right, response));
