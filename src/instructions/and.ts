import type { CoreAndInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreAndInstruction extends CoreTyped<CoreAndInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const and: CoreInstructionHandler<CoreAndInstruction> = (event, { left, right }, response) =>
  evaluate(event, left, response) && evaluate(event, right, response);
