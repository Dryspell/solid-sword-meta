import { Engine } from "excalibur";
import styles from "./UnitMenu.module.css";
import { Unit } from "../unit";
import { getUnitMenuPosition, worldDistanceToPage } from "./utils";
import { createSignal, onCleanup, Setter } from "solid-js";

export type MenuOption = {
	key?: string;
	text: string;
	onClick: () => void;
};

const generateResizeListener =
	(
		game: Engine,
		unit: Unit,
		setMenuPosition: Setter<{ left: number; top: number }>
	) =>
	() => {
		document.documentElement.style.setProperty(
			"--pixel-conversion",
			worldDistanceToPage(1, game).toString()
		);

		setMenuPosition(getUnitMenuPosition(unit, game));
	};

export default function UnitMenu({
	unit,
	game,
	menuOptions = [
		{
			key: "move",
			text: "Move",
			onClick: () => {
				console.log("move");
			},
		},
		{
			key: "attack",
			text: "Attack",
			onClick: () => {
				console.log("attack");
			},
		},
		{
			key: "pass",
			text: "Pass",
			onClick: () => {
				console.log("pass");
			},
		},
	],
}: {
	unit: Unit;
	game: Engine;
	menuOptions?: MenuOption[];
}) {
	const [unitMenuPosition, setUnitMenuPosition] = createSignal(
		getUnitMenuPosition(unit, game)
	);

	document.documentElement.style.setProperty(
		"--pixel-conversion",
		worldDistanceToPage(1, game).toString()
	);

	const resizeListener = generateResizeListener(
		game,
		unit,
		setUnitMenuPosition
	);
	window.addEventListener("resize", resizeListener);

	onCleanup(() => {
		window.removeEventListener("resize", resizeListener);
	});

	return (
		<>
			{/* <div class={styles.overlay}></div> */}
			<div
				class={`${styles.menu} ${styles.show}`}
				style={{
					left: `${unitMenuPosition().left}px`,
					top: `${unitMenuPosition().top}px`,
				}}
			>
				<div class={styles.titleBar}></div>
				<div class={styles.options}>
					{menuOptions?.map((option) => (
						<button class={styles.button} onClick={option.onClick}>
							{option.text}
						</button>
					))}
				</div>
			</div>
		</>
	);
}
