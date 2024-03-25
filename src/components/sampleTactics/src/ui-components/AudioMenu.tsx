import { Accessor } from "solid-js";

export default function AudioMenu(
	soundOn: Accessor<boolean>,
	toggleSound: () => void
) {
	return (
		<>
			{soundOn() ? (
				<button onClick={toggleSound} class="material-symbols-outlined">
					volume_up
				</button>
			) : (
				<button onClick={toggleSound} class="material-symbols-outlined">
					volume_off
				</button>
			)}
		</>
	);
}
