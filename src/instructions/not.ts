import type { CoreNotInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreNotInstruction extends CoreTyped<CoreNotInstructionType> {
  value: CoreInstructionOrLiteral;
}

export const not: CoreInstructionHandler<CoreNotInstruction> = (event, { value }, response) =>
  !evaluate(event, value, response);
