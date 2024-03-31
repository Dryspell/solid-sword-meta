import {
	Actor,
	type ActorArgs,
	Animation,
	Collider,
	CollisionContact,
	CollisionType,
	type Engine,
	type Entity,
	range,
	Side,
	SpriteSheet,
	vec,
	Vector,
} from "excalibur";
import { type Accessor, createEffect, createSignal, type Setter } from "solid-js";
import { render } from "solid-js/web";
import { gameUiId } from "../../../Entry";
import { Resources } from "../../resources";
import { type Direction, directions } from "../../utils/mathUtils";
import { type Action } from "./minionActions";
import { SelectableActor } from "../SelectableActor";
import { DestinationIndicator } from "./DestinationIndicator";
import { HealthBarUI } from "./HealthBarUI";

const spriteSheet_COLUMNS = 12;
const spriteSheet_ROWS = 21;
const sprite_WIDTH = 42;
const sprite_HEIGHT = 56;
const sprite_MARGIN = { x: 22, y: 8 };

const defaultSpriteSheet = SpriteSheet.fromImageSource({
	image: Resources.FemaleCharacterSpriteSheet,
	grid: {
		columns: spriteSheet_COLUMNS,
		rows: spriteSheet_ROWS,
		spriteWidth: sprite_WIDTH,
		spriteHeight: sprite_HEIGHT,
	},
	spacing: {
		originOffset: { x: 11, y: 12 },
		margin: sprite_MARGIN,
	},
});

const WALK_ANIMATION_SPEED = 100;
const IDLE_ANIMATION_SPEED = 200;

const ANIMATIONS = (spriteSheet: SpriteSheet = defaultSpriteSheet) => ({
	walk: {
		up: Animation.fromSpriteSheet(
			spriteSheet,
			range(8 * 12, 8 * 12 + 8),
			WALK_ANIMATION_SPEED
		),
		left: Animation.fromSpriteSheet(
			spriteSheet,
			range(9 * 12, 9 * 12 + 8),
			WALK_ANIMATION_SPEED
		),
		down: Animation.fromSpriteSheet(
			spriteSheet,
			range(10 * 12, 10 * 12 + 8),
			WALK_ANIMATION_SPEED
		),
		right: Animation.fromSpriteSheet(
			spriteSheet,
			range(11 * 12, 11 * 12 + 8),
			WALK_ANIMATION_SPEED
		),
	},
	idle: {
		up: Animation.fromSpriteSheet(
			spriteSheet,
			range(8 * 12, 8 * 12 + 1),
			IDLE_ANIMATION_SPEED
		),
		left: Animation.fromSpriteSheet(
			spriteSheet,
			range(9 * 12, 9 * 12 + 1),
			IDLE_ANIMATION_SPEED
		),
		down: Animation.fromSpriteSheet(
			spriteSheet,
			range(10 * 12, 10 * 12 + 1),
			IDLE_ANIMATION_SPEED
		),
		right: Animation.fromSpriteSheet(
			spriteSheet,
			range(11 * 12, 11 * 12 + 1),
			IDLE_ANIMATION_SPEED
		),
	},
});

export const isMinion = (entity: Entity): entity is Minion =>
	entity instanceof Minion;

export type State = {
	direction: Direction;
	action: Action;
	destination: Vector;
	postUpdates: Record<string, () => void>;
	pos: Vector;
};

export class Minion extends SelectableActor {
	state: Accessor<State>;
	setState: Setter<State>;
	destinationIndicator: DestinationIndicator;

	constructor(
		config: { pos: Vector } & ActorArgs,
		spriteData?: {
			spriteSheet?: SpriteSheet;
			spriteWidth?: number;
			spriteHeight?: number;
			spriteMargin?: { x: number; y: number };
		}
	) {
		super({
			...config,
			radius: (spriteData?.spriteWidth ?? sprite_WIDTH) / 2,
			width: spriteData?.spriteWidth ?? sprite_WIDTH,
			height:
				spriteData?.spriteHeight ??
				sprite_HEIGHT +
					(spriteData?.spriteMargin?.y ?? sprite_MARGIN.y),
		});

		this.addTag("minion");
		this.body.collisionType = CollisionType.Active;

		const [state, setState] = createSignal<State>({
			direction: "down",
			action: "idle",
			destination:
				config.pos?.clone() ??
				((config?.x && config?.y && vec(config.x, config.y)) ||
					vec(0, 0)),
			postUpdates: {},
			pos:
				config.pos?.clone() ??
				((config?.x && config?.y && vec(config.x, config.y)) ||
					vec(0, 0)),
		});
		this.state = state;
		this.setState = setState;
		this.destinationIndicator = new DestinationIndicator(state);

		directions.forEach((direction) => {
			this.graphics.add(
				`walk_${direction}`,
				ANIMATIONS(spriteData?.spriteSheet).walk[direction]
			);
			this.graphics.add(
				`idle_${direction}`,
				ANIMATIONS(spriteData?.spriteSheet).idle[direction]
			);
		});

		this.graphics.use("idle_down");
	}

	onInitialize(engine: Engine<any>): void {
		super.onInitialize(engine);

		engine.add(this.destinationIndicator);

		render(
			() => (
				<HealthBarUI state={this.state} actor={this} engine={engine} />
			),
			document.getElementById(gameUiId)!
		);
	}

	onPostUpdate(engine: Engine, delta: number) {
		super.onPostUpdate(engine, delta);

		this.graphics.use(`${this.state().action}_${this.state().direction}`);

		if (this.pos.distance(this.state().destination) >= this.width / 2) {
			const pointerVec = this.state()
				.destination.sub(this.pos)
				.normalize();
			this.vel = pointerVec.clone().scale(100);
		} else {
			this.vel = Vector.Zero;
		}

		this.setState((prev) => ({ ...prev, pos: this.pos }));

		Object.values(this.state().postUpdates).forEach((update) => update());
	}
}
