import { DisplayMode, Engine } from "excalibur";
import { gameCanvasId, gameUiId } from "../Entry";
import { createSignal } from "solid-js";
import { generateSelectionRect } from "./utils/graphicsUtils";
import { createMinion } from "./minion";
import { loader } from "./resources";
import { handleWalk } from "./minionActions";
import { isActor } from "./utils/excaliburUtils";
import { isWithinRect } from "./utils/mathUtils";

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

	game.start(loader).then(async () => {
		const player = await createMinion(game);

		const [isDragging, setIsDragging] = createSignal(false);

		const unitSelector = generateSelectionRect(game);

		game.input.pointers.on("down", (pointerEvent) => {
			console.log("pointerEvent", pointerEvent);

			if (pointerEvent.button === "Left") {
				setIsDragging(true);
				unitSelector.selectionRect.pos =
					pointerEvent.coordinates.worldPos;
			}
			if (pointerEvent.button === "Right") {
				handleWalk(player, pointerEvent.coordinates.worldPos);
			}
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
			if (pointerEvent.button === "Left") {
				setIsDragging(false);
				unitSelector.selectionRect.graphics.hide();
				const selectedActors = game.currentScene.world
					.queryTags(["selectable"])
					.entities.filter((ent) => {
						if (!isActor(ent)) return false;
						const dimensions = unitSelector.getDimensions();
						return isWithinRect(ent.pos, dimensions);
					});
				console.log({ selectedActors });
			}
		});

		// game.input.pointers.
	});

	return game;
}
