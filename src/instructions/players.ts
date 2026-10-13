import { Type } from "typebox";
import { CorePlayersInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicPlayersInstruction = Type.Call(CoreTyped, [CorePlayersInstructionType]);
export const CorePlayersInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicPlayersInstruction",
);
export type CorePlayersInstruction = Type.Static<typeof CorePlayersInstruction>;

export const players: CoreInstructionHandler<CorePlayersInstruction> = ({ game: { state } }) =>
  state.getAllPlayers();
