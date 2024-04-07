import { Color, DisplayMode, Engine, PointerScope, vec } from "excalibur";
import { gameCanvasId } from "../Entry";
import { isMinion, Minion } from "./components/minion/Minion";
import { createLoader } from "./resources";
import { assignDestinations } from "./utils/mathUtils";
import { generateSelectionRect } from "./components/UnitSelector";
import { cameraControls } from "./components/camera/Camera";
import { HarvestableResource } from "./components/harvestable/Harvestable";
import { createSignal } from "solid-js";
import {
	enterCombat,
	harvestResource,
} from "./components/minion/minionActions";

const PADDING = 50;

export type GameState = {
	cameraLock: boolean;
	players: Player[];
	activePlayer: Player | undefined;
};

export type Player = {
	userId: string;
	teamColor: Color;
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
			players: [
				{ userId: "player1", teamColor: Color.Blue.lighten(0.75) },
				{ userId: "player2", teamColor: Color.Red.lighten(0.75) },
				{ userId: "player3", teamColor: Color.Green.lighten(0.75) },
			],
			activePlayer: undefined,
		});

		setGameState((prev) => ({
			...prev,
			activePlayer: gameState().players[0],
		}));

		console.log(game.canvasWidth, game.canvasHeight);

		const minions = gameState()
			.players.map((player) =>
				Array.from({ length: 5 }, (_, i) => {
					const minion = new Minion(
						{
							pos: vec(
								PADDING +
									Math.random() *
										(game.canvasWidth - 2 * PADDING),
								PADDING +
									Math.random() *
										(game.canvasHeight - 2 * PADDING)
							),
						},
						player
					);

					game.add(minion);
					return minion;
				})
			)
			.flat();

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

		const unitSelector = generateSelectionRect(game, gameState);

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
					return;
				}

				const targetEnemyMinion = minions.find((minion) => {
					return (
						minion.owner !== gameState().activePlayer &&
						minion.collider.bounds.contains(pointerEvent.worldPos)
					);
				});

				if (targetEnemyMinion) {
					console.log("targetEnemyMinion", targetEnemyMinion);
					const selectedMinions = game.currentScene.world
						.queryTags(["selectable"])
						.entities.filter((ent) => {
							if (!isMinion(ent)) return false;
							return ent.selected();
						}) as Minion[];

					enterCombat(targetEnemyMinion, selectedMinions);
					return;
				}

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
				return selectedMinions;
			}
		});

		cameraControls(game);
	});

	return game;
}
