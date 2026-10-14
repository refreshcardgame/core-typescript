import { Type } from "typebox";
import { CoreReturnInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicReturnInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreReturnInstructionType])],
  { value: Type.Optional(Type.Ref("CoreCyclicInstructionOrLiteral")) },
);
export const CoreReturnInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicReturnInstruction",
);
export type CoreReturnInstruction = Type.Static<typeof CoreReturnInstruction>;

export const returnHandler: CoreInstructionHandler<CoreReturnInstruction> = (
  event,
  { value },
  response,
) => {
  event.result = typeof value === "undefined" ? true : Boolean(evaluate(event, value, response));
};
