import * as ex from "excalibur";
import { loader } from "./resources";
import { gameCanvasId } from "../Entry";
import { Unit } from "./unit";

export default function initializeGame() {
	const game = new ex.Engine({
		width: 800,
		height: 800,
		canvasElementId: gameCanvasId,

		// displayMode: ex.DisplayMode.FitScreenAndFill,
		pixelArt: true,
		pixelRatio: 2,
		suppressHiDPIScaling: true,
		configurePerformanceCanvas2DFallback: {
			allow: false,
		},
	});

	// const level1 = new LevelBase(Level1Data, "level1");
	// game.addScene(level1.name, level1);

	const unit = new Unit(300, 400);
	game.add(unit);

	game.start(loader).then(() => {
		console.log("Game started");
	});
}
