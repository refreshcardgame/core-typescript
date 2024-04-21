import type { CoreCardOptions } from "./card.ts";
import basicCharacter from "./cards/basic-character.json" with { type: "json" };

export interface CoreDefinitionOptions {
  cards?: Record<string, CoreCardOptions>;
}

export class CoreDefinition {
  cards: Map<string, CoreCardOptions>;

  constructor({ cards }: CoreDefinitionOptions = {}) {
    this.cards = new Map(Object.entries(cards ?? {}));
    this.defineCard(basicCharacter);
  }

  defineCard(options: CoreCardOptions): CoreCardOptions {
    this.cards.set(options.name, options);
    return options;
  }
}
