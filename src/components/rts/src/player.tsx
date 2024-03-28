import {
	Actor,
	Animation,
	Color,
	Debug,
	Engine,
	ImageFiltering,
	ImageSource,
	range,
	Sprite,
	SpriteSheet,
	vec,
} from "excalibur";
import { Accessor, createEffect, createSignal, Setter } from "solid-js";
import { render } from "solid-js/web";
import { gameUiId } from "../Entry";
import { Resources } from "./resources";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuGroupLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const ButtonUI = ({
	state,
	setState,
}: {
	state: Accessor<State>;
	setState: Setter<State>;
}) => {
	const buttonStyle = {
		padding: "1rem",
		margin: "1rem",
	};

	return (
		<div
			style={{
				position: "absolute",
				top: "0px",
				right: "0px",
				padding: "1rem",
			}}
		>
			<div>
				<DropdownMenu>
					<DropdownMenuTrigger as={Button}>
						Select Action
					</DropdownMenuTrigger>
					<DropdownMenuGroup>
						<DropdownMenuGroupLabel>Action</DropdownMenuGroupLabel>
						<DropdownMenuRadioGroup
							value={state().action}
							onChange={(value) =>
								setState((prev) => ({
									...prev,
									action: value as "idle" | "walk",
								}))
							}
						>
							<DropdownMenuRadioItem value="idle">
								idle
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="walk">
								walk
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
				</DropdownMenu>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "up",
						}))
					}
				>
					Up
				</Button>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "down",
						}))
					}
				>
					Down
				</Button>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "left",
						}))
					}
				>
					Left
				</Button>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "right",
						}))
					}
				>
					Right
				</Button>
			</div>
		</div>
	);
};

type State = {
	direction: "up" | "down" | "left" | "right";
	action: "idle" | "walk";
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
const IDLE_ANIMATION_SPEED = 150;

export const createPlayer = async (game: Engine) => {
	const player = new Actor({
		name: "player",
		// pos: vec(game.halfCanvasWidth, game.halfCanvasHeight),
		x: 1.5 * game.halfCanvasWidth,
		y: game.halfCanvasHeight,
	});

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

	(["up", "left", "down", "right"] as const).forEach((direction) => {
		player.graphics.add(`walk_${direction}`, ANIMATIONS.walk[direction]);
		player.graphics.add(`idle_${direction}`, ANIMATIONS.idle[direction]);
	});

	const [state, setState] = createSignal<State>({
		direction: "down",
		action: "idle",
	});
	player.graphics.use(`idle_down`);

	createEffect(() => {
		console.log({ state: state() });
		player.graphics.use(`${state().action}_${state().direction}`);
	});

	game.add(player);

	render(
		() => <ButtonUI state={state} setState={setState} />,
		document.getElementById(gameUiId)!
	);

	return player;
};
