import { Type } from "typebox";
import { CoreIfInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawIfInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreIfInstructionType])],
  {
    condition: CoreRawInstructionOrLiteralRef,
    then: CoreRawInstructionOrLiteralRef,
    else: Type.Optional(CoreRawInstructionOrLiteralRef),
  },
);
export const CoreIfInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawIfInstruction");
export type CoreIfInstruction = Type.Static<typeof CoreIfInstruction>;

export const ifHandler: CoreInstructionHandler<CoreIfInstruction> = (
  event,
  { condition, then: thenInstruction, else: elseInstruction },
  response,
) => {
  if (evaluate(event, condition, response)) return evaluate(event, thenInstruction, response);
  if (typeof elseInstruction !== "undefined") return evaluate(event, elseInstruction, response);
};
