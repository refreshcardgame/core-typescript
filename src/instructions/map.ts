import { Type } from "typebox";
import {
  CORE_FLAT_MAP_INSTRUCTION_TYPE,
  CoreFlatMapInstructionType,
  CoreMapInstructionType,
} from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreCyclicInstructionRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicMapInstruction = Type.Interface(
  [Type.Call(CoreTyped, [Type.Union([CoreFlatMapInstructionType, CoreMapInstructionType])])],
  {
    each: CoreCyclicInstructionOrLiteralRef,
    of: CoreCyclicInstructionRef,
    to: CoreCyclicInstructionOrLiteralRef,
  },
);
export const CoreMapInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicMapInstruction");
export type CoreMapInstruction = Type.Static<typeof CoreMapInstruction>;

export const map: CoreInstructionHandler<CoreMapInstruction> = (
  event,
  { type, each, of, to },
  response,
) => {
  const array = evaluate(event, of, response);
  if (!Array.isArray(array)) return;
  const name = String(evaluate(event, each, response));
  const previous = event.getVariable(name);
  const result =
    type === CORE_FLAT_MAP_INSTRUCTION_TYPE
      ? array.flatMap((value) => {
          event.setVariable(name, value);
          return evaluate(event, to, response);
        })
      : array.map((value) => {
          event.setVariable(name, value);
          return evaluate(event, to, response);
        });
  event.setVariable(name, previous);
  return result;
};
