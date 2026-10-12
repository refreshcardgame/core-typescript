import {
  CORE_FLAT_MAP_INSTRUCTION_TYPE,
  type CoreFlatMapInstructionType,
  type CoreMapInstructionType,
} from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstruction,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreMapInstruction extends CoreTyped<
  CoreFlatMapInstructionType | CoreMapInstructionType
> {
  each: CoreInstructionOrLiteral;
  of: CoreInstruction;
  to: CoreInstructionOrLiteral;
}

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
