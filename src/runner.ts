import { Type } from "typebox";
import { CORE_OPTION_GENERIC } from "./constants/runner.ts";
import { CoreRange } from "./math.ts";
import type { CoreCall, CoreEquals } from "./type.ts";

export const CoreOptionGeneric = Type.Parameter(
  CORE_OPTION_GENERIC,
  Type.Unknown(),
  Type.Unknown(),
);
export type CoreOptionGenericEquals = CoreEquals<typeof CoreOptionGeneric>;
export const CoreOptionRef = Type.Ref(CORE_OPTION_GENERIC);
export const CoreRequestField = Type.Generic(
  [CoreOptionGeneric],
  Type.Interface([CoreRange], {
    default: Type.Optional(Type.Array(Type.Number())),
    options: Type.Array(CoreOptionRef),
  }),
);
export type CoreRequestField<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreRequestField,
  [TOption]
>;
export const CoreRequestFields = Type.Generic(
  [CoreOptionGeneric],
  Type.Record(Type.String(), Type.Call(CoreRequestField, [CoreOptionRef])),
);
export type CoreRequestFields<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreRequestFields,
  [TOption]
>;
export const CoreRequest = Type.Generic(
  [CoreOptionGeneric],
  Type.Record(Type.String(), Type.Call(CoreRequestFields, [CoreOptionRef])),
);
export type CoreRequest<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreRequest,
  [TOption]
>;

export const CoreResponseFields = Type.Generic(
  [CoreOptionGeneric],
  Type.Record(Type.String(), Type.Array(CoreOptionRef)),
);
export type CoreResponseFields<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreResponseFields,
  [TOption]
>;
export const CoreResponse = Type.Generic(
  [CoreOptionGeneric],
  Type.Record(Type.String(), Type.Call(CoreResponseFields, [CoreOptionRef])),
);
export type CoreResponse<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreResponse,
  [TOption]
>;
export const CoreRawResponseFields = Type.Call(CoreResponseFields, [Type.Number()]);
export type CoreRawResponseFields = Type.Static<typeof CoreRawResponseFields>;
export const CoreRawResponse = Type.Call(CoreResponse, [Type.Number()]);
export type CoreRawResponse = Type.Static<typeof CoreRawResponse>;
export type CoreRunner = Iterator<CoreRequest, boolean, CoreRawResponse>;
export type CoreRunnerResult =
  CoreRunner extends Iterator<infer T, infer TReturn> ? IteratorResult<T, TReturn> : never;

export function validateResponse(
  request: CoreRequest = {},
  response: CoreRawResponse = {},
): boolean {
  for (const [player, fields] of Object.entries(request)) {
    const responseFields = response[player];
    if (!responseFields) return false;

    for (const [field, { max, min, options }] of Object.entries(fields)) {
      const responseOptions = responseFields[field];
      if (!responseOptions) return false;
      const { length } = responseOptions;
      if (length < min || length > max || !responseOptions.every((index) => index in options))
        return false;
    }
  }

  return true;
}

export function wrapResult(value?: boolean | CoreRequest): CoreRunnerResult {
  return typeof value === "boolean" ? { done: true, value } : { done: false, value: value ?? {} };
}
