import type { CoreNotEqualInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreNotEqualInstruction extends CoreTyped<CoreNotEqualInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const notEqual: CoreInstructionHandler<CoreNotEqualInstruction> = (
  event,
  { left, right },
  response,
) => evaluate(event, left, response) !== evaluate(event, right, response);
