import { Type } from "typebox";
import { CoreTurnInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CorePlayer } from "../player.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicTurnInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreTurnInstructionType])],
  { player: Type.Ref("CoreCyclicInstruction") },
);
export const CoreTurnInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicTurnInstruction");
export type CoreTurnInstruction = Type.Static<typeof CoreTurnInstruction>;

export const turn: CoreInstructionHandler<CoreTurnInstruction> = (event, { player }, response) => {
  const evaluated = evaluate(event, player, response);
  if (evaluated instanceof CorePlayer) return evaluated.turn();
};
