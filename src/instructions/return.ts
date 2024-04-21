import type { CoreReturnInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreReturnInstruction extends CoreType<CoreReturnInstructionType> {
  value?: CoreInstructionOrLiteral;
}

export const returnHandler: CoreInstructionHandler<CoreReturnInstruction> = (
  event,
  { value },
  response,
) => {
  event.result = typeof value === "undefined" ? true : Boolean(evaluate(event, value, response));
};
