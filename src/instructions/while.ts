import { Type } from "typebox";
import { CoreWhileInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicWhileInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreWhileInstructionType])],
  {
    condition: Type.Ref("CoreCyclicInstruction"),
    do: Type.Optional(Type.Ref("CoreCyclicInstruction")),
  },
);
export const CoreWhileInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicWhileInstruction");
export type CoreWhileInstruction = Type.Static<typeof CoreWhileInstruction>;

export const whileHandler: CoreInstructionHandler<CoreWhileInstruction> = (
  event,
  { condition, do: doInstruction },
  response,
) => {
  while (evaluate(event, condition, response)) {
    if (doInstruction) evaluate(event, doInstruction, response);
  }
};
