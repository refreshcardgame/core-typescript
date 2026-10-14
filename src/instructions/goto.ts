import { Type } from "typebox";
import { CoreGotoInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicGotoInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreGotoInstructionType])],
  { target: Type.Ref("CoreCyclicInstructionOrLiteral") },
);
export const CoreGotoInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicGotoInstruction");
export type CoreGotoInstruction = Type.Static<typeof CoreGotoInstruction>;

export const goto: CoreInstructionHandler<CoreGotoInstruction> = (event, { target }, response) => {
  event.step = Number(evaluate(event, target, response));
};
