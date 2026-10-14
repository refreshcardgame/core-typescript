import { Type } from "typebox";
import { CoreForInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicForInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreForInstructionType])],
  {
    each: Type.Ref("CoreCyclicInstructionOrLiteral"),
    of: Type.Ref("CoreCyclicInstruction"),
    do: Type.Ref("CoreCyclicInstruction"),
  },
);
export const CoreForInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicForInstruction");
export type CoreForInstruction = Type.Static<typeof CoreForInstruction>;

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
