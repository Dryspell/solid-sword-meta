import { Vector } from "excalibur";
import { type Minion } from "./Minion";
import { getDirection4 } from "../../utils/mathUtils";

export const actions = ["idle", "walk"] as const;
export type Action = (typeof actions)[number];

const generatePostUpdateWalk = (minion: Minion) => {
	return () => {
		if (
			minion.pos.distance(minion.state().destination) <
			minion.width / 2
		) {
			const { walk, ...postUpdates } = minion.state().postUpdates;
			minion.vel = Vector.Zero;
			minion.destinationIndicator.hide();
			minion.setState((prev) => ({
				...prev,
				action: "idle",
				postUpdates,
			}));
		}
	};
};

export const handleWalk = (minion: Minion, destination: Vector) => {
	const pointerVec = destination.sub(minion.pos).normalize();
	minion.vel = pointerVec.clone().scale(100);
	minion.destinationIndicator.show();
	minion.setState((prev) => ({
		...prev,
		action: "walk",
		direction: getDirection4(pointerVec),
		destination,
		postUpdates: {
			...prev.postUpdates,
			walk: generatePostUpdateWalk(minion),
		},
	}));
};
