import { Type } from "typebox";

export const CoreRange = Type.Object({ max: Type.Number(), min: Type.Number() });
export type CoreRange = Type.Static<typeof CoreRange>;

export class CoreTuple {
  elements: number[];

  constructor(...elements: number[]) {
    this.elements = elements;
  }

  static from(expression: string): CoreTuple {
    const elements = expression.slice(1, -1).split(",").map(parseInt);
    return new CoreTuple(...elements);
  }

  equals(other: CoreTuple): boolean {
    const dimensions = this.getDimensions();
    if (dimensions !== other.getDimensions()) return false;

    for (let dimension = 0; dimension < dimensions; dimension++) {
      if (this.elements[dimension] !== other.elements[dimension]) return false;
    }

    return true;
  }

  getDimensions(): number {
    return this.elements.length;
  }

  toJSON(): string {
    return this.toString();
  }

  toString(): string {
    return `(${this.elements.join()})`;
  }
}
