import type { CoreVariableInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreVariableInstruction extends CoreTyped<CoreVariableInstructionType> {
  name: CoreInstructionOrLiteral;
  set?: CoreInstructionOrLiteral;
}

export const variable: CoreInstructionHandler<CoreVariableInstruction> = (
  event,
  { name, set },
  response,
) => {
  return typeof set === "undefined"
    ? event.getVariable(String(evaluate(event, name, response)))
    : event.setVariable(String(evaluate(event, name, response)), evaluate(event, set, response));
};
