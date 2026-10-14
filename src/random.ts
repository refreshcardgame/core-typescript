import type { DoublyLinkedList, SinglyLinkedList } from "data-structure-typed";
import { Random, Xoshiro128StarStarRNG } from "random";
import { Type } from "typebox";

export const CoreRandomData = Type.Object({
  next: Type.Number(),
  seed: Type.Number(),
});
export type CoreRandomData = Type.Static<typeof CoreRandomData>;
export const CoreRandomOptions = Type.Partial(CoreRandomData);
export type CoreRandomOptions = Type.Static<typeof CoreRandomOptions>;

function generateSeed(): number {
  return (crypto.getRandomValues(new Uint32Array(1)) as Uint32Array & { 0: number })[0];
}

export class CoreRandom {
  next: number;
  random: Random;
  seed: number;

  constructor({ next, seed }: CoreRandomOptions = {}) {
    this.next = next ?? 0;
    this.seed = seed ?? generateSeed();
    this.random = new Random(new Xoshiro128StarStarRNG(this.seed));

    for (let i = 0; i < this.next; i++) {
      this.random.next();
    }

    // oxlint-disable-next-line typescript/unbound-method
    this.random.rng.next = new Proxy(this.random.rng.next, {
      apply: (target, thisArg, argArray) => {
        this.next++;
        return Reflect.apply(target, thisArg, argArray) as ReturnType<typeof this.random.rng.next>;
      },
    });
  }

  generateID(type: string, name: string): string {
    return `${type}-${name}-${crypto.randomUUID()}`;
  }

  shuffle<TList extends DoublyLinkedList | SinglyLinkedList>(list: TList): TList {
    const array = this.random.shuffle(list.toArray());
    list.clear();
    list.pushMany(array);
    return list;
  }

  toShuffled<T>(array: T[]): T[] {
    return this.random.shuffle(array);
  }

  toJSON(): CoreRandomData {
    const { next, seed } = this;
    return { next, seed };
  }
}
