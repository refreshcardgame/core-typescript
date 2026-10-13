import { Type } from "typebox";
import { CORE_RESOLVE_EVENT_PHASE } from "../constants/event.ts";
import { CoreTriggerInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicTriggerInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreTriggerInstructionType])],
  { timings: Type.Array(CoreCyclicInstructionOrLiteralRef) },
);
export const CoreTriggerInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicTriggerInstruction",
);
export type CoreTriggerInstruction = Type.Static<typeof CoreTriggerInstruction>;

export const trigger: CoreInstructionHandler<CoreTriggerInstruction> = (
  event,
  { timings },
  response,
) => {
  if (event.phase === CORE_RESOLVE_EVENT_PHASE)
    return event.trigger(
      timings.map((instruction) => String(evaluate(event, instruction, response))),
      response ?? {},
    );
};
