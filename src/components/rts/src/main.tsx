import { DisplayMode, Engine, vec } from "excalibur";
import { gameCanvasId, gameUiId } from "../Entry";
import { generateSelectionRect } from "./utils/graphicsUtils";
import { createMinion, isMinion, Minion } from "./minion";
import { loader } from "./resources";
import { handleWalk } from "./minionActions";
import { assignDestinations, isWithinRect } from "./utils/mathUtils";
import { isSelectable } from "./selectableActor";

export default function initializeGame() {
	const game = new Engine({
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
		// const player = await createMinion(game);
		const minions = Array.from({ length: 10 }, (_, i) => {
			const minion = new Minion({
				pos: vec(
					Math.random() * game.canvasWidth,
					Math.random() * game.canvasHeight
				),
			});

			game.add(minion);
		});

		const unitSelector = generateSelectionRect(game);

		game.input.pointers.on("down", (pointerEvent) => {
			// console.log("pointerEvent", pointerEvent);

			if (pointerEvent.button === "Left") {
				unitSelector.setIsDragging(true);
				unitSelector.selectionRect.pos =
					pointerEvent.coordinates.worldPos;
			}
			if (pointerEvent.button === "Right") {
				const selectedMinions = game.currentScene.world
					.queryTags(["selectable"])
					.entities.filter((ent) => {
						if (!isMinion(ent)) return false;
						return ent.selected();
					}) as Minion[];

				assignDestinations(
					pointerEvent.coordinates.worldPos,
					selectedMinions
				);

				// handleWalk(player, pointerEvent.coordinates.worldPos);
			}
		});

		game.input.pointers.on("move", (pointerEvent) => {
			if (unitSelector.isDragging()) {
				unitSelector.setDimensions(
					unitSelector.selectionRect.pos,
					pointerEvent.coordinates.worldPos
				);
				unitSelector.selectionRect.graphics.use(unitSelector.rect);
			}
		});

		game.input.pointers.on("up", (pointerEvent) => {
			if (pointerEvent.button === "Left") {
				unitSelector.setIsDragging(false);
				unitSelector.selectionRect.graphics.hide();
				const selectedActors = game.currentScene.world
					.queryTags(["selectable"])
					.entities.filter((ent) => {
						if (!isSelectable(ent)) return false;
						const dimensions = unitSelector.getDimensions();

						console.log(ent, ent.pos);
						const withinRect = isWithinRect(ent.pos, dimensions);
						if (withinRect) {
							ent.setSelected(true);
						} else {
							ent.setSelected(false);
						}
						return isWithinRect(ent.pos, dimensions);
					});
				console.log({ selectedActors });
			}
		});

		// game.input.pointers.
	});

	return game;
}
