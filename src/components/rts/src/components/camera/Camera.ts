import {
	Color,
	Debug,
	EasingFunctions,
	type Engine,
	Keys,
	PointerButton,
	vec,
} from "excalibur";
import { createSignal } from "solid-js";

const cameraDebug = (game: Engine) => {
	// Draw debug lines to show the bounds of the camera

	Debug.drawLine(
		vec(
			game.currentScene.camera.pos.x - (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y - (game.canvasHeight / 2) * 0.8
		),
		vec(
			game.currentScene.camera.pos.x + (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y - (game.canvasHeight / 2) * 0.8
		),
		{
			color: Color.Red,
		}
	);
	Debug.drawLine(
		vec(
			game.currentScene.camera.pos.x - (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y + (game.canvasHeight / 2) * 0.8
		),
		vec(
			game.currentScene.camera.pos.x + (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y + (game.canvasHeight / 2) * 0.8
		),
		{
			color: Color.Red,
		}
	);
	Debug.drawLine(
		vec(
			game.currentScene.camera.pos.x - (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y - (game.canvasHeight / 2) * 0.8
		),
		vec(
			game.currentScene.camera.pos.x - (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y + (game.canvasHeight / 2) * 0.8
		),
		{
			color: Color.Red,
		}
	);
	Debug.drawLine(
		vec(
			game.currentScene.camera.pos.x + (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y - (game.canvasHeight / 2) * 0.8
		),
		vec(
			game.currentScene.camera.pos.x + (game.canvasWidth / 2) * 0.8,
			game.currentScene.camera.pos.y + (game.canvasHeight / 2) * 0.8
		),
		{
			color: Color.Red,
		}
	);
};

const MIN_DRAG_DISTANCE = 50;

export function cameraControls(game: Engine, debug: boolean = false) {
	const [pan, setPan] = createSignal({
		isDragging: false,
		dragStart: game.currentScene.camera.pos.clone(),
	});

	game.input.keyboard.on("release", (event) => {
		if (event.key === Keys.Space) {
			game.currentScene.camera.move(
				vec(game.halfCanvasWidth, game.halfCanvasHeight),
				500,
				EasingFunctions.Linear
			);
		}
	});

	game.input.pointers.on("down", (pointerEvent) => {
		if (pointerEvent.button === PointerButton.Middle) {
			setPan({
				isDragging: true,
				dragStart: game.currentScene.camera.pos.clone(),
			});
		}
		return;
	});

	game.input.pointers.on("move", (pointerEvent) => {
		debug && cameraDebug(game);

		if (pan().isDragging) {
			const distanceFromStart = pan().dragStart.distance(
				pointerEvent.worldPos
			);
			if (distanceFromStart > MIN_DRAG_DISTANCE) {
				const pointerVec = pointerEvent.worldPos
					.sub(game.currentScene.camera.pos)
					.normalize();

				game.currentScene.camera.move(
					game.currentScene.camera.pos.add(pointerVec.scale(100)),
					100,
					EasingFunctions.EaseInOutQuad
				);
			}
		}

		if (
			!pan().isDragging &&
			(pointerEvent.worldPos.x <
				game.currentScene.camera.pos.x - (game.canvasWidth / 2) * 0.8 ||
				pointerEvent.worldPos.x >
					game.currentScene.camera.pos.x +
						(game.canvasWidth / 2) * 0.8 ||
				pointerEvent.worldPos.y <
					game.currentScene.camera.pos.y -
						(game.canvasHeight / 2) * 0.8 ||
				pointerEvent.worldPos.y >
					game.currentScene.camera.pos.y +
						(game.canvasHeight / 2) * 0.8)
		) {
			const pointerVec = pointerEvent.worldPos
				.sub(game.currentScene.camera.pos)
				.normalize();

			game.currentScene.camera.vel = pointerVec.scale(100);
		} else {
			game.currentScene.camera.vel = vec(0, 0);
		}
		return;
	});

	game.input.pointers.on("up", (pointerEvent) => {
		if (pointerEvent.button === PointerButton.Middle) {
			setPan({
				isDragging: false,
				dragStart: game.currentScene.camera.pos.clone(),
			});
		}
		return;
	});
}
