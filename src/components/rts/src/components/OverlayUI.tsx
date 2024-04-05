import { FiCameraOff } from "solid-icons/fi";
import { FiCamera } from "solid-icons/fi";
import { type Accessor, type Setter } from "solid-js";
import { type GameState } from "../main";

export default function OverlayUI(props: {
	gameState: Accessor<GameState>;
	setGameState: Setter<GameState>;
}) {
	return (
		<div class="absolute top-0 left-0 p-2">
			<button
				class="p-2 bg-gray-800 text-white rounded"
				title="Toggle Camera"
			>
				{props.gameState().cameraLock ? (
					<FiCameraOff class="w-6 h-6" />
				) : (
					<FiCamera class="w-6 h-6" />
				)}
			</button>
		</div>
	);
}
