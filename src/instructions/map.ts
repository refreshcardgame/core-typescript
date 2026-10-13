import { Type } from "typebox";
import {
  CORE_FLAT_MAP_INSTRUCTION_TYPE,
  CoreFlatMapInstructionType,
  CoreMapInstructionType,
} from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  CoreRawInstructionRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawMapInstruction = Type.Interface(
  [Type.Call(CoreTyped, [Type.Union([CoreFlatMapInstructionType, CoreMapInstructionType])])],
  {
    each: CoreRawInstructionOrLiteralRef,
    of: CoreRawInstructionRef,
    to: CoreRawInstructionOrLiteralRef,
  },
);
export const CoreMapInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawMapInstruction");
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
