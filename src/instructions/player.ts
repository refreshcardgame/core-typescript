import { Type } from "typebox";
import { CorePlayerInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicPlayerInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CorePlayerInstructionType])],
  { index: Type.Optional(Type.Ref("CoreCyclicInstructionOrLiteral")) },
);
export const CorePlayerInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicPlayerInstruction",
);
export type CorePlayerInstruction = Type.Static<typeof CorePlayerInstruction>;

export const player: CoreInstructionHandler<CorePlayerInstruction> = (
  event,
  { index },
  response,
) =>
  typeof index === "undefined"
    ? event.getPlayer()
    : event.game.state.getPlayer(Number(evaluate(event, index, response)));
