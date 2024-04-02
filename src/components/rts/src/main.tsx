import { Color, Debug, DisplayMode, Engine, vec } from "excalibur";
import { gameCanvasId } from "../Entry";
import { isMinion, Minion } from "./components/minion/Minion";
import { createLoader } from "./resources";
import { assignDestinations } from "./utils/mathUtils";
import { generateSelectionRect } from "./components/UnitSelector";
import { cameraControls } from "./components/Camera";

const PADDING = 50;

export default function initializeGame() {
	const game = new Engine({
		canvasElementId: gameCanvasId,
		displayMode: DisplayMode.FillContainer,
		pixelArt: true,
		pixelRatio: 2,
		suppressHiDPIScaling: true,
		configurePerformanceCanvas2DFallback: {
			allow: false,
		},
	});

	const loader = createLoader();

	// game.debug.collider.showAll = true;
	// game.debug.entity.showId = true;
	game.toggleDebug();

	game.start(loader).then(async () => {
		console.log(game.canvasWidth, game.canvasHeight);

		const minions = Array.from({ length: 20 }, (_, i) => {
			const minion = new Minion({
				pos: vec(
					PADDING + Math.random() * (game.canvasWidth - 2 * PADDING),
					PADDING + Math.random() * (game.canvasHeight - 2 * PADDING)
				),
			});

			game.add(minion);
		});

		const unitSelector = generateSelectionRect(game);

		game.input.pointers.on("down", (pointerEvent) => {
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
			}
		});

		cameraControls(game);
	});

	return game;
}
