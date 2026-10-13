import { Type } from "typebox";
import { CoreRoundInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicRoundInstruction = Type.Call(CoreTyped, [CoreRoundInstructionType]);
export const CoreRoundInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicRoundInstruction");
export type CoreRoundInstruction = Type.Static<typeof CoreRoundInstruction>;

export const round: CoreInstructionHandler<CoreRoundInstruction> = ({ game }) => game.round();
