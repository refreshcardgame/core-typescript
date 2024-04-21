import type { CoreRange } from "./math.ts";

export interface CoreRequestField<TOption = unknown> extends CoreRange {
  defaultOptions?: number[];
  options: TOption[];
}

export type CoreRequestFields<TOption = unknown> = Record<string, CoreRequestField<TOption>>;
export type CoreRequest<TOption = unknown> = Record<string, CoreRequestFields<TOption>>;
export type CoreRawResponse = Record<string, Record<string, number[]>>;
export type CoreRunner = Iterator<CoreRequest, boolean, CoreRawResponse>;
export type CoreRunnerResult =
  CoreRunner extends Iterator<infer T, infer TReturn> ? IteratorResult<T, TReturn> : never;
export type CoreResponseFields<T = unknown> = Record<string, T[]>;
export type CoreResponse = Record<string, CoreResponseFields>;

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
