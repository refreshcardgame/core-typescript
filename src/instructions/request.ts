import type { CoreRequestInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import { isObtainablePayload, toTypedPayload } from "../payload.ts";
import type { CoreRequest, CoreRequestFields } from "../runner.ts";
import type { CoreType } from "../type.ts";

export interface CoreRequestInstruction extends CoreType<CoreRequestInstructionType> {
  request: CoreRequest<CoreInstructionOrLiteral>;
}

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
