import { Type } from "typebox";
import {
  CoreEndPhaseName,
  CoreMainPhaseName,
  CorePhaseInstructionType,
  CoreStartPhaseName,
} from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CorePlayer } from "../player.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicPhaseInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CorePhaseInstructionType])],
  {
    name: Type.Union([CoreEndPhaseName, CoreMainPhaseName, CoreStartPhaseName]),
    player: Type.Ref("CoreCyclicInstruction"),
  },
);
export const CorePhaseInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicPhaseInstruction");
export type CorePhaseInstruction = Type.Static<typeof CorePhaseInstruction>;

export const phase: CoreInstructionHandler<CorePhaseInstruction> = (
  event,
  { name, player },
  response,
) => {
  const evaluated = evaluate(event, player, response);
  if (evaluated instanceof CorePlayer) return evaluated[`${name}Phase`]();
};
