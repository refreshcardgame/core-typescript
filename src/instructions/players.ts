import type { CorePlayersInstructionType } from "../constants/instruction.ts";
import type { CoreInstructionHandler } from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export type CorePlayersInstruction = CoreTyped<CorePlayersInstructionType>;

export const players: CoreInstructionHandler<CorePlayersInstruction> = ({ game: { state } }) =>
  state.getAllPlayers();
