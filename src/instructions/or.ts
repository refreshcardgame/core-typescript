import type { CoreOrInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreOrInstruction extends CoreTyped<CoreOrInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const or: CoreInstructionHandler<CoreOrInstruction> = (event, { left, right }, response) =>
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing
  evaluate(event, left, response) || evaluate(event, right, response);
