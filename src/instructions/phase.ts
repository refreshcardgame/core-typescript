import type {
  CoreEndPhaseName,
  CoreMainPhaseName,
  CorePhaseInstructionType,
  CoreStartPhaseName,
} from "../constants/instruction.ts";
import { evaluate, type CoreInstruction, type CoreInstructionHandler } from "../instruction.ts";
import { CorePlayer } from "../player.ts";
import type { CoreType } from "../type.ts";

export type CorePhaseName = CoreEndPhaseName | CoreMainPhaseName | CoreStartPhaseName;

export interface CorePhaseInstruction extends CoreType<CorePhaseInstructionType> {
  name: CorePhaseName;
  player: CoreInstruction;
}

export const phase: CoreInstructionHandler<CorePhaseInstruction> = (
  event,
  { name, player },
  response,
) => {
  const evaluated = evaluate(event, player, response);
  if (evaluated instanceof CorePlayer) return evaluated[`${name}Phase`]();
};
