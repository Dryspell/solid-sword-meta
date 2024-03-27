import { onMount } from "solid-js";
import initializeGame from "./src/main";
// import AudioMenu from "./src/ui-components/AudioMenu";

export const gameCanvasId = "gameCanvas";
export const gameUiId = "gameUi";

export default function Game() {
	onMount(() => {
		initializeGame();
	});

	return (
		<div
			style={{
				"justify-content": "center",
				"align-items": "center",
				position: "relative",
				width: "100%",
				height: "90vh",
			}}
		>
			<canvas id={gameCanvasId}></canvas>
			<div id={gameUiId} />
			{/* <AudioMenu /> */}
		</div>
	);
}
