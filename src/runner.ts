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
export const CoreGenericRequestField = Type.Interface([CoreRange], {
  default: Type.Optional(Type.Array(Type.Number())),
  options: Type.Array(CoreOptionRef),
});
export const CoreRequestField = Type.Generic([CoreOptionGeneric], CoreGenericRequestField);
export type CoreRequestField<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreRequestField,
  [TOption]
>;
export const CoreGenericRequestForm = Type.Record(Type.String(), CoreGenericRequestField);
export const CoreRequestForm = Type.Generic([CoreOptionGeneric], CoreGenericRequestForm);
export type CoreRequestForm<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreRequestForm,
  [TOption]
>;
export const CoreGenericRequest = Type.Record(Type.String(), CoreGenericRequestForm);
export const CoreRequest = Type.Generic([CoreOptionGeneric], CoreGenericRequest);
export type CoreRequest<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreRequest,
  [TOption]
>;

export const CoreGenericResponseForm = Type.Record(Type.String(), Type.Array(CoreOptionRef));
export const CoreResponseForm = Type.Generic([CoreOptionGeneric], CoreGenericResponseForm);
export type CoreResponseForm<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreResponseForm,
  [TOption]
>;
export const CoreGenericResponse = Type.Record(Type.String(), CoreGenericResponseForm);
export const CoreResponse = Type.Generic([CoreOptionGeneric], CoreGenericResponse);
export type CoreResponse<TOption = CoreOptionGenericEquals> = CoreCall<
  typeof CoreResponse,
  [TOption]
>;
export const CoreRawResponseForm = Type.Call(CoreResponseForm, [Type.Number()]);
export type CoreRawResponseForm = Type.Static<typeof CoreRawResponseForm>;
export const CoreRawResponse = Type.Call(CoreResponse, [Type.Number()]);
export type CoreRawResponse = Type.Static<typeof CoreRawResponse>;
export type CoreRunner = Iterator<CoreRequest, boolean, CoreRawResponse>;
export type CoreRunnerResult =
  CoreRunner extends Iterator<infer T, infer TReturn> ? IteratorResult<T, TReturn> : never;

export function validateResponse(
  request: CoreRequest = {},
  response: CoreRawResponse = {},
): boolean {
  for (const [player, form] of Object.entries(request)) {
    const responseForm = response[player];
    if (!responseForm) return false;

    for (const [field, { max, min, options }] of Object.entries(form)) {
      const responseOptions = responseForm[field];
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
