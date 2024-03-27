import { DisplayMode, Engine, vec } from "excalibur";
import { gameCanvasId } from "../Entry";
import { createSignal } from "solid-js";
import { drawLine } from "./graphicsUtils";

export default function initializeGame() {
	const game = new Engine({
		// width: 800,
		// height: 600,
		canvasElementId: gameCanvasId,
		displayMode: DisplayMode.FitContainerAndFill,
		pixelArt: true,
		pixelRatio: 2,
		suppressHiDPIScaling: true,
		configurePerformanceCanvas2DFallback: {
			allow: false,
		},
	});

	game.start();

	const [isDragging, setIsDragging] = createSignal(false);
	const [lastPosition, setLastPosition] = createSignal(vec(0, 0));

	game.input.pointers.on("down", (pointerEvent) => {
		setIsDragging(true);
		setLastPosition(pointerEvent.coordinates.worldPos);
		// console.log({ down: pointerEvent });
	});

	game.input.pointers.on("move", (pointerEvent) => {
		if (isDragging()) {
			// console.log({ move: pointerEvent });
			const currentPosition = pointerEvent.coordinates.worldPos;
			drawLine(game, lastPosition(), currentPosition);
			setLastPosition(currentPosition);
		}
	});

	game.input.pointers.on("up", (pointerEvent) => {
		setIsDragging(false);
		console.log({ up: pointerEvent });
	});
}
