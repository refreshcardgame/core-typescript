import { Type } from "typebox";
import { CoreForInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  CoreRawInstructionRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawForInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreForInstructionType])],
  { each: CoreRawInstructionOrLiteralRef, of: CoreRawInstructionRef, do: CoreRawInstructionRef },
);
export const CoreForInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawForInstruction");
export type CoreForInstruction = Type.Static<typeof CoreForInstruction>;

export const forHandler: CoreInstructionHandler<CoreForInstruction> = (
  event,
  { each, of, do: doInstruction },
  response,
) => {
  const array = evaluate(event, of, response);
  if (!Array.isArray(array)) return;
  const name = String(evaluate(event, each, response));
  const previous = event.getVariable(name);

  for (const value of array) {
    event.setVariable(name, value);
    if (doInstruction) evaluate(event, doInstruction, response);
  }

  event.setVariable(name, previous);
};
