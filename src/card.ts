import type { SetRequired } from "type-fest";
import type { CoreColor } from "./color.ts";
import { CORE_CARD_TYPE, type CoreCardType } from "./constants/card.ts";
import type { CoreGame } from "./game.ts";
import type { CoreObject } from "./object.ts";
import type { CoreTypedPayload } from "./payload.ts";
import type { CorePlayer } from "./player.ts";

export type CoreCardPayload = CoreTypedPayload<CoreCardType>;

export interface CoreCardInformation {
  attack?: number;
  colors: CoreColor[];
  defense?: number;
  name: string;
  owner?: string;
  types: string[];
}

export interface CoreCardData extends CoreCardPayload, CoreCardInformation {
  object?: string;
}

export type CoreCardOptions = SetRequired<Partial<CoreCardData>, "name">;

export class CoreCard {
  attack?: number;
  colors: CoreColor[];
  defense?: number;
  game: CoreGame;
  id: string;
  name: string;
  object?: string;
  owner?: string;
  type = CORE_CARD_TYPE;
  types: string[];

  constructor(
    game: CoreGame,
    { attack, colors, defense, id, name, object, owner, types }: CoreCardOptions,
  ) {
    this.game = game;
    this.name = name;
    this.id = id ?? this.game.state.random.generateID(this.type, name);
    if (typeof attack === "number") this.attack = attack;
    this.colors = colors ?? [];
    if (typeof defense === "number") this.defense = defense;
    if (typeof object === "string") this.object = object;
    if (typeof owner === "string") this.owner = owner;
    this.types = types ?? [];
  }

  getObject(): CoreObject | undefined {
    return this.game.state.getObject(this.object);
  }

  getOwner(): CorePlayer | undefined {
    return this.game.state.getPlayer(this.owner);
  }

  toJSON(): CoreCardData {
    const { attack, colors, defense, id, name, object, owner, type, types } = this;
    const data: CoreCardData = { colors, id, name, type, types };
    if (typeof attack === "number") data.attack = attack;
    if (typeof defense === "number") data.defense = defense;
    if (typeof object === "string") data.object = object;
    if (typeof owner === "string") data.owner = owner;
    return data;
  }
}
