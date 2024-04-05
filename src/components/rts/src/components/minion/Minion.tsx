import {
	type ActorArgs,
	Animation,
	type Collider,
	type CollisionContact,
	CollisionType,
	type Engine,
	type Entity,
	range,
	type Side,
	SpriteSheet,
	vec,
	type Vector,
} from "excalibur";
import { type Accessor, createSignal, type Setter } from "solid-js";
import { render } from "solid-js/web";
import { gameUiId } from "../../../Entry";
import { Resources } from "../../resources";
import { type Direction, directions } from "../../utils/mathUtils";
import { type Action } from "./minionActions";
import { SelectableActor } from "../SelectableActor";
import { DestinationIndicator } from "./DestinationIndicator";
import { MinionAboveHeadBars } from "./MinionAboveHeadBarsUI";

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
	harvest: {
		up: Animation.fromSpriteSheet(
			spriteSheet,
			range(4 * 12, 4 * 12 + 7),
			WALK_ANIMATION_SPEED
		),
		left: Animation.fromSpriteSheet(
			spriteSheet,
			range(5 * 12, 5 * 12 + 7),
			WALK_ANIMATION_SPEED
		),
		down: Animation.fromSpriteSheet(
			spriteSheet,
			range(6 * 12, 6 * 12 + 7),
			WALK_ANIMATION_SPEED
		),
		right: Animation.fromSpriteSheet(
			spriteSheet,
			range(7 * 12, 7 * 12 + 7),
			WALK_ANIMATION_SPEED
		),
	},
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

export type UnitState = {
	direction: Direction;
	action: Action;
	destination: Vector;
	work: number;
	harvestWork: number;
	pos: Vector;
	postUpdates: Record<string, () => void>;
	collisionActions: Record<
		string,
		(
			self: Collider,
			other: Collider,
			side: Side,
			contact: CollisionContact
		) => void
	>;
	hp: number;
	maxHp: number;
};

export class Minion extends SelectableActor {
	state: Accessor<UnitState>;
	setState: Setter<UnitState>;
	destinationIndicator: DestinationIndicator;
	disposeUI?: () => void;

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

		const [state, setState] = createSignal<UnitState>(
			{
				direction: "down",
				action: "idle",
				destination:
					config.pos?.clone() ??
					((config?.x && config?.y && vec(config.x, config.y)) ||
						vec(0, 0)),
				pos:
					config.pos?.clone() ??
					((config?.x && config?.y && vec(config.x, config.y)) ||
						vec(0, 0)),
				postUpdates: {},
				work: 0,
				harvestWork: 1,
				collisionActions: {},
				hp: 100,
				maxHp: 100,
			}
			// { equals: false }
		);
		this.state = state;
		this.setState = setState;
		this.destinationIndicator = new DestinationIndicator(state);

		// const [position, setPosition] = createSignal<Vector>(
		// 	config.pos?.clone() ??
		// 		((config?.x && config?.y && vec(config.x, config.y)) ||
		// 			vec(0, 0)),
		// 	{ equals: false }
		// );
		// this.position = position;
		// this.setPosition = setPosition;

		directions.forEach((direction) => {
			this.graphics.add(
				`walk_${direction}`,
				ANIMATIONS(spriteData?.spriteSheet).walk[direction]
			);
			this.graphics.add(
				`idle_${direction}`,
				ANIMATIONS(spriteData?.spriteSheet).idle[direction]
			);
			this.graphics.add(
				`harvest_${direction}`,
				ANIMATIONS(spriteData?.spriteSheet).harvest[direction]
			);
		});

		this.graphics.use("idle_down");
	}

	onInitialize(engine: Engine<any>): void {
		super.onInitialize(engine);

		engine.add(this.destinationIndicator);

		this.disposeUI = render(
			() => (
				<MinionAboveHeadBars
					state={this.state}
					actor={this}
					engine={engine}
				/>
			),
			document.getElementById(gameUiId)!
		);
	}

	onCollisionStart(
		self: Collider,
		other: Collider,
		side: Side,
		contact: CollisionContact
	): void {
		Object.values(this.state().collisionActions).forEach(
			(collisionAction) => collisionAction(self, other, side, contact)
		);
	}

	onPostUpdate(engine: Engine, delta: number) {
		super.onPostUpdate(engine, delta);

		const postUpdates = Object.values(this.state().postUpdates);
		(postUpdates.length
			? postUpdates
			: [() => this.setState((prev) => ({ ...prev }))]
		).forEach((update) => update());
	}
}
