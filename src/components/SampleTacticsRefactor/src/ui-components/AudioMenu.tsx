import { createSignal, onMount } from "solid-js";
import styles from "./AudioMenu.module.css";
import { FaSolidVolumeHigh } from "solid-icons/fa";
import { FaSolidVolumeXmark } from "solid-icons/fa";
import { Resources } from "../resources";
import { Sound } from "excalibur";

export default function AudioMenu() {
	const levels = new Map<Sound, number>([
		[Resources.HitSound, 1.0],
		[Resources.MoveSound, 1.0],
		[Resources.SelectSound, 1.0],
		[Resources.TargetSelectSound, 1.0],
		[Resources.LevelMusic1, 0.05],
		[Resources.LevelMusic2, 0.05],
		[Resources.ExplosionSound, 1.0],
		[Resources.TitleMusic, 0.05],
	]);

	onMount(() => {
		Object.values(Resources).forEach((resource) => {
			if (resource instanceof Sound) {
				resource.volume = levels.get(resource) ?? 1.0;
			}
		});
	});

	const [soundOn, setSoundOn] = createSignal(true);
	const toggleSound = () => {
		setSoundOn(!soundOn());

		Object.values(Resources).forEach((resource) => {
			if (resource instanceof Sound) {
				resource.volume = soundOn() ? levels.get(resource) ?? 1.0 : 0;
			}
		});
	};

	return (
		<>
			<div class={styles.host}>
				{soundOn() ? (
					<button
						class={`${styles.button} ${styles["materialSymbolsOutlined"]}`}
						onClick={toggleSound}
					>
						<FaSolidVolumeHigh />
					</button>
				) : (
					<button
						onClick={toggleSound}
						class={`${styles.button} ${styles["materialSymbolsOutlined"]}`}
					>
						<FaSolidVolumeXmark />
					</button>
				)}
			</div>
		</>
	);
}
