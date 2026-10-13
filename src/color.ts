import { Type } from "typebox";
import { CoreColors } from "./constants/color.ts";

export const CoreColor = Type.Index(CoreColors, Type.Number());
export type CoreColor = Type.Static<typeof CoreColor>;
