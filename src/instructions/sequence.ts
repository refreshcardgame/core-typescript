import type { CoreSequenceInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreSequenceInstruction extends CoreType<CoreSequenceInstructionType> {
  instructions: CoreInstructionOrLiteral[];
}

export const sequence: CoreInstructionHandler<CoreSequenceInstruction> = (
  event,
  { instructions },
  response,
) =>
  instructions.reduce<unknown>((_, instruction) => evaluate(event, instruction, response), void 0);
