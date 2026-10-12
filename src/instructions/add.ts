import type { CoreAddInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreAddInstruction extends CoreTyped<CoreAddInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const add: CoreInstructionHandler<CoreAddInstruction> = (event, { left, right }, response) =>
  Number(evaluate(event, left, response)) + Number(evaluate(event, right, response));
