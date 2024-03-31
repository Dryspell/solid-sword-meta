import { type GameState } from "./breakoutUIGame";
import { type Engine } from "excalibur";
import { type Accessor, createSignal, type Setter } from "solid-js";

export default function UI(props: {
	gameState: Accessor<GameState>;
	setGameState: Setter<GameState>;
	game: Engine;
	actions: { generateRandomBrick: () => void };
}) {
	const [inputValue, setInputValue] = createSignal("");

	return (
		<>
			<div style={{ position: "absolute", right: 0, top: "55%" }}>
				<button
					style={{
						padding: "1rem",
						margin: "1rem",
						"border-radius": "0.5rem",
						"background-color": "#2e026d",
						color: "white",
						border: "none",
					}}
					onClick={() => {
						props.setGameState((prev) => ({
							...prev,
							score: prev.score + 1,
						}));
					}}
				>
					{`Score: ${props.gameState().score}`}
				</button>
				<button
					style={{
						padding: "1rem",
						"border-radius": "0.5rem",
						"background-color": "#2e026d",
						color: "white",
						border: "none",
					}}
					onClick={() => {
						props.setGameState((prev) => ({
							...prev,
							lives: prev.lives - 1,
						}));
					}}
				>
					{`Lives: ${props.gameState().lives}`}
				</button>

				<div>
					<label for="myInput">
						{inputValue() ?? "Type Something..."}
					</label>
					<input
						type="myInput"
						id="myInput"
						placeholder="Type Something..."
						// value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						style={{ color: "black" }}
					/>
				</div>

				<button
					style={{
						padding: "1rem",
						"border-radius": "0.5rem",
						"background-color": "#2e026d",
						color: "white",
						border: "none",
					}}
					onClick={() => {
						props.actions.generateRandomBrick();
					}}
				>
					Generate Brick
				</button>
			</div>
		</>
	);
}
