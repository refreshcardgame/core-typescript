import { Type } from "typebox";
import { CoreRequestInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { isObtainablePayload, toTypedPayload } from "../payload.ts";
import { CoreRequest, type CoreRequestFields } from "../runner.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicRequestInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreRequestInstructionType])],
  { request: Type.Call(CoreRequest, [CoreCyclicInstructionOrLiteralRef]) },
);
export const CoreRequestInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicRequestInstruction",
);
export type CoreRequestInstruction = Type.Static<typeof CoreRequestInstruction>;

export const request: CoreInstructionHandler<CoreRequestInstruction> = (
  event,
  { request },
  response,
) => {
  const evaluatedRequest: CoreRequest = {};

  for (const [player, fields] of Object.entries(request)) {
    const requestFields: CoreRequestFields = (evaluatedRequest[player] = {});

    for (const [key, field] of Object.entries(fields)) {
      requestFields[key] = {
        ...field,
        options: field.options.map((option) => {
          let evaluatedOption = evaluate(event, option, response);
          if (isObtainablePayload(evaluatedOption))
            evaluatedOption = toTypedPayload(evaluatedOption);
          return evaluatedOption;
        }),
      };
    }
  }

  event.request = evaluatedRequest;
};
