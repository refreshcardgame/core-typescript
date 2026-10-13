import { Type } from "typebox";
import { CoreEqualInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicEqualInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreEqualInstructionType])],
  { left: CoreCyclicInstructionOrLiteralRef, right: CoreCyclicInstructionOrLiteralRef },
);
export const CoreEqualInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicEqualInstruction");
export type CoreEqualInstruction = Type.Static<typeof CoreEqualInstruction>;

export const equal: CoreInstructionHandler<CoreEqualInstruction> = (
  event,
  { left, right },
  response,
) => evaluate(event, left, response) === evaluate(event, right, response);
