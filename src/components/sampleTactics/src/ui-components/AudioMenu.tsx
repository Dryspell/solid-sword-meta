import { createSignal } from "solid-js";
import styles from "./AudioMenu.module.css";
import { FaSolidVolumeHigh } from "solid-icons/fa";
import { FaSolidVolumeXmark } from "solid-icons/fa";

export default function AudioMenu(props: {
	toggleMute: (shouldMute: boolean) => void;
}) {
	const [soundOn, setSoundOn] = createSignal(true);
	const toggleSound = () => {
		setSoundOn(!soundOn());
		props.toggleMute(!soundOn());
	};

	console.log(styles);

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
