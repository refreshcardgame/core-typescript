import { Type } from "typebox";
import { CoreVariableInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicVariableInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreVariableInstructionType])],
  {
    name: CoreCyclicInstructionOrLiteralRef,
    set: Type.Optional(CoreCyclicInstructionOrLiteralRef),
  },
);
export const CoreVariableInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicVariableInstruction",
);
export type CoreVariableInstruction = Type.Static<typeof CoreVariableInstruction>;

export const variable: CoreInstructionHandler<CoreVariableInstruction> = (
  event,
  { name, set },
  response,
) => {
  return typeof set === "undefined"
    ? event.getVariable(String(evaluate(event, name, response)))
    : event.setVariable(String(evaluate(event, name, response)), evaluate(event, set, response));
};
