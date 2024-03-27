import { Actor, Color, DisplayMode, Engine, Rectangle, vec } from "excalibur";
import { gameCanvasId } from "../Entry";
import { createSignal } from "solid-js";
import {
	drawLine,
	generateFilledRect,
	generateSelectionRect,
} from "./graphicsUtils";

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

	const unitSelector = generateSelectionRect(game);

	game.input.pointers.on("down", (pointerEvent) => {
		setIsDragging(true);
		unitSelector.selectionRect.pos = pointerEvent.coordinates.worldPos;
	});

	game.input.pointers.on("move", (pointerEvent) => {
		if (isDragging()) {
			unitSelector.setDimensions(
				unitSelector.selectionRect.pos,
				pointerEvent.coordinates.worldPos
			);
			unitSelector.selectionRect.graphics.use(unitSelector.rect);
		}
	});

	game.input.pointers.on("up", (pointerEvent) => {
		setIsDragging(false);
		unitSelector.selectionRect.graphics.hide();
	});
}
