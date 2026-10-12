import type { CoreGreaterInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreGreaterInstruction extends CoreTyped<CoreGreaterInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const greater: CoreInstructionHandler<CoreGreaterInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) > Number(evaluate(event, right, response));
