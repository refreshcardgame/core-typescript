import type { CoreForInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstruction,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreForInstruction extends CoreType<CoreForInstructionType> {
  each: CoreInstructionOrLiteral;
  of: CoreInstruction;
  do?: CoreInstruction;
}

export const forHandler: CoreInstructionHandler<CoreForInstruction> = (
  event,
  { each, of, do: doInstruction },
  response,
) => {
  const array = evaluate(event, of, response);
  if (!Array.isArray(array)) return;
  const name = String(evaluate(event, each, response));
  const previous = event.getVariable(name);

  for (const value of array) {
    event.setVariable(name, value);
    if (doInstruction) evaluate(event, doInstruction, response);
  }

  event.setVariable(name, previous);
};
