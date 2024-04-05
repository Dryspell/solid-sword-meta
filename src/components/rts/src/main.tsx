import { DisplayMode, Engine, PointerScope, vec } from "excalibur";
import { gameCanvasId } from "../Entry";
import { isMinion, Minion } from "./components/minion/Minion";
import { createLoader } from "./resources";
import { assignDestinations } from "./utils/mathUtils";
import { generateSelectionRect } from "./components/UnitSelector";
import { cameraControls } from "./components/camera/Camera";
import { HarvestableResource } from "./components/harvestable/Harvestable";
import { createSignal } from "solid-js";
import { harvestResource } from "./components/minion/minionActions";

const PADDING = 50;

export type GameState = {
	cameraLock: boolean;
};

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
		pointerScope: PointerScope.Canvas,
	});

	const loader = createLoader();

	// game.debug.collider.showAll = true;
	// game.debug.entity.showId = true;
	// game.toggleDebug();

	game.start(loader).then(async () => {
		const [gameState, setGameState] = createSignal<GameState>({
			cameraLock: false,
		});

		console.log(game.canvasWidth, game.canvasHeight);

		const minions = Array.from({ length: 20 }, (_, i) => {
			const minion = new Minion({
				pos: vec(
					PADDING + Math.random() * (game.canvasWidth - 2 * PADDING),
					PADDING + Math.random() * (game.canvasHeight - 2 * PADDING)
				),
			});

			game.add(minion);
			return minion;
		});

		const harvestables = Array.from({ length: 3 }, (_, i) => {
			const harvestable = new HarvestableResource(
				{
					pos: vec(
						PADDING +
							Math.random() * (game.canvasWidth - 2 * PADDING),
						PADDING +
							Math.random() * (game.canvasHeight - 2 * PADDING)
					),
				},
				{ resourceType: "iron", maxAmount: 15 }
			);

			game.add(harvestable);
			return harvestable;
		});

		const unitSelector = generateSelectionRect(game);

		game.input.pointers.on("down", (pointerEvent) => {
			if (pointerEvent.button === "Right") {
				console.log(pointerEvent);

				const targetHarvestable = harvestables.find((harvestable) => {
					return harvestable.collider.bounds.contains(
						pointerEvent.worldPos
					);
				});

				if (targetHarvestable) {
					console.log("targetHarvestable", targetHarvestable);
					const selectedMinions = game.currentScene.world
						.queryTags(["selectable"])
						.entities.filter((ent) => {
							if (!isMinion(ent)) return false;
							return ent.selected();
						}) as Minion[];

					harvestResource(targetHarvestable, selectedMinions);
				} else {
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
			}
		});

		cameraControls(game);
	});

	return game;
}
