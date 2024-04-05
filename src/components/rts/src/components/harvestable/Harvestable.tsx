import {
	type ActorArgs,
	CollisionType,
	type Engine,
	type Scene,
	type SpriteSheet,
	Vector,
} from "excalibur";
import { type Accessor, createSignal, type Setter } from "solid-js";
import { render } from "solid-js/web";
import { gameUiId } from "../../../Entry";
import { Resources } from "../../resources";
import { SelectableActor } from "../SelectableActor";
import { HarvestableAboveBars } from "./HarvestableAboveBarsUI";

const sprite_WIDTH = 64;
const sprite_HEIGHT = 64;

const defaultSprite = Resources.Iron_Big;

export type ResourceType = "iron" | "wood" | "food" | "gold";

export type ResourceState = {
	amountRemaining: number;
	maxAmount: number;
	pos: Vector;
};

export class HarvestableResource extends SelectableActor {
	resourceType: ResourceType;
	harvestRate: number;
	harvestWork: number;
	disposeUI?: () => void;
	state: Accessor<ResourceState>;
	setState: Setter<ResourceState>;

	constructor(
		config: { pos: Vector } & ActorArgs,
		resourceData: {
			resourceType: ResourceType;
			maxAmount: number;
			initialAmount?: number;
			harvestRate?: number;
			harvestWork?: number;
		},
		spriteData?: {
			spriteSheet?: SpriteSheet;
			spriteWidth?: number;
			spriteHeight?: number;
			spriteMargin?: { x: number; y: number };
		}
	) {
		super({
			...config,
			radius: ((spriteData?.spriteWidth ?? sprite_WIDTH) * 0.95) / 2,
			width: spriteData?.spriteWidth ?? sprite_WIDTH,
			height: spriteData?.spriteHeight ?? sprite_HEIGHT,
			anchor: Vector.Half,
		});

		this.addTag("harvestable");
		this.body.collisionType = CollisionType.Fixed;

		const [state, setState] = createSignal<ResourceState>({
			amountRemaining:
				resourceData.initialAmount ?? resourceData.maxAmount,
			maxAmount: resourceData.maxAmount,
			pos: config.pos,
		});
		this.state = state;
		this.setState = setState;
		this.resourceType = resourceData.resourceType;
		this.harvestRate = resourceData.harvestRate ?? 1;
		this.harvestWork = resourceData.harvestWork ?? 300;

		this.graphics.use(defaultSprite.toSprite());
		return this;
	}

	onInitialize(engine: Engine<any>): void {
		super.onInitialize(engine);

		const ui = document
			.getElementById(gameUiId)!
			.appendChild(document.createElement("div"));
		this.disposeUI = render(
			() => (
				<HarvestableAboveBars
					state={this.state}
					actor={this}
					engine={engine}
				/>
			),
			ui
		);
	}

	onPostUpdate(engine: Engine, delta: number) {
		this.setState((prev) => ({ ...prev }));
	}

	onPostKill(scene: Scene<unknown>): void {
		super.onPostKill(scene);
		this.disposeUI?.();
	}
}
