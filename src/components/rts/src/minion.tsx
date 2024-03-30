import {
	Actor,
	Animation,
	Engine,
	range,
	SpriteSheet,
	Vector,
} from "excalibur";
import { createEffect, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { gameUiId } from "../Entry";
import { Resources } from "./resources";
import { Direction, directions } from "./utils/mathUtils";
import { Action } from "./minionActions";
import { ButtonUI, HealthBarUI } from "./Ui/minionUI";

export type State = {
	direction: Direction;
	action: Action;
	destination: Vector;
	postUpdates: Record<string, () => void>;
	pos: Vector;
};

const spriteSheet_COLUMNS = 12;
const spriteSheet_ROWS = 21;
const sprite_WIDTH = 42;
const sprite_HEIGHT = 56;

const spriteSheet = SpriteSheet.fromImageSource({
	image: Resources.FemaleCharacterSpriteSheet,
	grid: {
		columns: spriteSheet_COLUMNS,
		rows: spriteSheet_ROWS,
		spriteWidth: sprite_WIDTH,
		spriteHeight: sprite_HEIGHT,
	},
	spacing: {
		originOffset: { x: 11, y: 12 },
		margin: { x: 22, y: 8 },
	},
});

const WALK_ANIMATION_SPEED = 100;
const IDLE_ANIMATION_SPEED = 200;

export const createMinion = async (game: Engine) => {
	const actor = new Actor({
		// pos: vec(game.halfCanvasWidth, game.halfCanvasHeight),
		x: game.halfCanvasWidth,
		y: game.halfCanvasHeight,
		width: sprite_WIDTH,
		height: sprite_HEIGHT,
	});

	actor.addTag("minion");
	actor.addTag("selectable");

	const [state, setState] = createSignal<State>({
		direction: "down",
		action: "idle",
		destination: actor.pos.clone(),
		postUpdates: {},
		pos: actor.pos,
	});

	actor.onPostUpdate = (engine: Engine, delta: number) => {
		setState((prev) => ({ ...prev }));
		Object.values(state().postUpdates).forEach((update) => update());
	};

	const ANIMATIONS = {
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
	};

	directions.forEach((direction) => {
		actor.graphics.add(`walk_${direction}`, ANIMATIONS.walk[direction]);
		actor.graphics.add(`idle_${direction}`, ANIMATIONS.idle[direction]);
	});

	actor.graphics.use(`idle_down`);

	createEffect(() => {
		actor.graphics.use(`${state().action}_${state().direction}`);
	});

	game.add(actor);

	render(
		() => <ButtonUI state={state} setState={setState} />,
		document.getElementById(gameUiId)!
	);

	render(
		() => <HealthBarUI state={state} actor={actor} engine={game} />,
		document.getElementById(gameUiId)!
	);

	return { actor, state, setState };
};
