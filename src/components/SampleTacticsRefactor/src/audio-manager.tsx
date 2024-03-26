import * as ex from "excalibur";

import { Resources } from "./resources";
import { render } from "solid-js/web";
import AudioMenu from "./ui-components/AudioMenu";
import { audioMenuId } from "../Entry";

export class AudioManager {
	static levels = new Map<ex.Sound, number>([
		[Resources.HitSound, 1.0],
		[Resources.MoveSound, 1.0],
		[Resources.SelectSound, 1.0],
		[Resources.TargetSelectSound, 1.0],
		[Resources.LevelMusic1, 0.05],
		[Resources.LevelMusic2, 0.05],
		[Resources.ExplosionSound, 1.0],
		[Resources.TitleMusic, 0.05],
	]);

	static init() {
		for (let resource of Object.values(Resources)) {
			if (resource instanceof ex.Sound) {
				resource.volume = AudioManager.levels.get(resource) ?? 1.0;
			}
		}

		render(
			() => <AudioMenu toggleMute={this.toggleMute} />,
			document.getElementById(audioMenuId)!
		);
	}

	static toggleMute(shouldMute: boolean) {
		for (let resource of Object.values(Resources)) {
			if (resource instanceof ex.Sound) {
				resource.volume = shouldMute
					? 0
					: AudioManager.levels.get(resource) ?? 1.0;
			}
		}
	}
}
