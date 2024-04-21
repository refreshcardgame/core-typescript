import type { CoreEqualInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreEqualInstruction extends CoreType<CoreEqualInstructionType> {
  left: CoreInstructionOrLiteral;
  right: CoreInstructionOrLiteral;
}

export const equal: CoreInstructionHandler<CoreEqualInstruction> = (
  event,
  { left, right },
  response,
) => evaluate(event, left, response) === evaluate(event, right, response);
