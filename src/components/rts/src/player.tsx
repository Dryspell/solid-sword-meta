import {
	Actor,
	Animation,
	Engine,
	range,
	SpriteSheet,
	Vector,
} from "excalibur";
import { Accessor, createEffect, createSignal, Setter } from "solid-js";
import { render } from "solid-js/web";
import { gameUiId } from "../Entry";
import { Resources } from "./resources";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuGroupLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Direction, directions, getDirection4 } from "./mathUtils";
import { Action } from "./playerActions";
import { ButtonUI } from "./playerUI";

export type State = {
	direction: Direction;
	action: Action;
	destination: Vector;
	postUpdates: Record<string, () => void>;
};

const spriteSheet_COLUMNS = 12;
const spriteSheet_ROWS = 21;

const spriteSheet = SpriteSheet.fromImageSource({
	image: Resources.FemaleCharacterSpriteSheet,
	grid: {
		columns: spriteSheet_COLUMNS,
		rows: spriteSheet_ROWS,
		spriteWidth: 42,
		spriteHeight: 56,
	},
	spacing: {
		originOffset: { x: 11, y: 12 },
		margin: { x: 22, y: 8 },
	},
});

const WALK_ANIMATION_SPEED = 100;
const IDLE_ANIMATION_SPEED = 200;

export const createPlayer = async (game: Engine) => {
	const actor = new Actor({
		name: "player",
		// pos: vec(game.halfCanvasWidth, game.halfCanvasHeight),
		x: game.halfCanvasWidth,
		y: game.halfCanvasHeight,
	});

	const [state, setState] = createSignal<State>({
		direction: "down",
		action: "idle",
		destination: actor.pos.clone(),
		postUpdates: {},
	});

	actor.onPostUpdate = (engine: Engine, delta: number) => {
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
		console.log({ state: state() });
		actor.graphics.use(`${state().action}_${state().direction}`);
	});

	game.add(actor);

	render(
		() => <ButtonUI state={state} setState={setState} />,
		document.getElementById(gameUiId)!
	);

	return { actor, state, setState };
};
