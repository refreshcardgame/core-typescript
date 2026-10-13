import type { CoreSequenceInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../typed.ts";

export interface CoreSequenceInstruction extends CoreTyped<CoreSequenceInstructionType> {
  instructions: CoreInstructionOrLiteral[];
}

export const sequence: CoreInstructionHandler<CoreSequenceInstruction> = (
  event,
  { instructions },
  response,
) =>
  instructions.reduce<unknown>((_, instruction) => evaluate(event, instruction, response), void 0);
