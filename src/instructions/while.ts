import type { CoreWhileInstructionType } from "../constants/instruction.ts";
import { evaluate, type CoreInstruction, type CoreInstructionHandler } from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreWhileInstruction extends CoreType<CoreWhileInstructionType> {
  condition: CoreInstruction;
  do?: CoreInstruction;
}

export const whileHandler: CoreInstructionHandler<CoreWhileInstruction> = (
  event,
  { condition, do: doInstruction },
  response,
) => {
  while (evaluate(event, condition, response)) {
    if (doInstruction) evaluate(event, doInstruction, response);
  }
};
