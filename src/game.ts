import { CoreCard } from "./card.ts";
import {
  CORE_DECK_ZONE,
  CORE_EXTRA_ZONE,
  CORE_HAND_ZONE,
  CORE_SOUTH_CARDINAL,
} from "./constants/position.ts";
import { CoreDefinition, type CoreDefinitionOptions } from "./definition.ts";
import { CoreEvent, type CoreEventOptions } from "./event.ts";
import initial from "./events/initial.json" with { type: "json" };
import round from "./events/round.json" with { type: "json" };
import transfer from "./events/transfer.json" with { type: "json" };
import { CoreTuple } from "./math.ts";
import { CoreObject } from "./object.ts";
import { toDestinationData, type CoreDestination } from "./position.ts";
import {
  wrapResult,
  type CoreRawResponse,
  type CoreRunner,
  type CoreRunnerResult,
} from "./runner.ts";
import { CoreState, type CoreStateOptions } from "./state.ts";

export interface CoreGameOptions {
  definition?: CoreDefinitionOptions;
  state: CoreStateOptions;
  version?: bigint;
}

export class CoreGame implements CoreRunner {
  definition: CoreDefinition;
  state: CoreState;
  version: bigint;

  constructor({ definition, state, version }: CoreGameOptions) {
    this.definition = new CoreDefinition(definition);
    this.state = new CoreState(this, state);
    this.version = version ?? 0n;
  }

  initial(): CoreEvent {
    return this.state.run(new CoreEvent(this, initial as CoreEventOptions));
  }

  next(response?: CoreRawResponse): CoreRunnerResult {
    if (!this.state.started) return wrapResult();
    const result = this.state.getCurrentEvent()?.next(response);
    if (!result) return wrapResult();
    this.version++;
    if (!result.done) return result;
    this.state.stack.pop();
    return wrapResult();
  }

  round(): CoreEvent {
    return this.state.run(new CoreEvent(this, round as CoreEventOptions));
  }

  start(): this {
    if (this.state.started) return this;
    this.state.started = true;
    this.state.random.shuffle(this.state.order);

    for (const player of this.state.getAllPlayers()) {
      this.state.random.toShuffled(player.starting.deck).forEach((name, index) => {
        const options = this.definition.cards.get(name);
        if (options)
          player.in(
            this.state.setObject(CoreObject.from(this.state.setCard(new CoreCard(this, options)))),
            index < player.starting.deck.length - 1 ? CORE_DECK_ZONE : CORE_HAND_ZONE,
          );
      });

      player.starting.extra.forEach((name, index) => {
        const options = this.definition.cards.get(name);
        if (!options) return;
        const object = this.state.setObject(
          CoreObject.from(this.state.setCard(new CoreCard(this, options))),
        );

        if (!player.starting.characters.includes(index)) {
          player.in(object, CORE_EXTRA_ZONE);
          return;
        }

        if (this.state.dimensions === 2) {
          /** @todo */
        } else {
          this.state.inField(object, {
            coordinates: new CoreTuple(this.state.field.size),
            direction: CORE_SOUTH_CARDINAL,
          });
          player.characters.push(object.id);
        }
      });
    }

    this.initial();
    return this;
  }

  transfer(destinations: CoreDestination[]): CoreEvent {
    return this.state.run(
      new CoreEvent(this, {
        ...(transfer as CoreEventOptions),
        variables: { destinations: destinations.map(toDestinationData) },
      }),
    );
  }
}
