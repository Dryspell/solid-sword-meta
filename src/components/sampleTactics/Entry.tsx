import { onMount } from "solid-js";
import initializeGame from "./src/main";

export const gameCanvasId = "gameCanvas";
export const gameUiId = "gameUi";
export const audioMenuId = "audioMenu";

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
				width: "800px",
				height: "600px",
			}}
		>
			<canvas id={gameCanvasId}></canvas>
			<div
				id={gameUiId}
				// style={{ position: "absolute", display: "flex", width: "100%" }}
			/>
			<div id={audioMenuId} />
		</div>
	);
}
