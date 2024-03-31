import { Vector } from "excalibur";
import { createMinion, Minion } from "./minion";
import { getDirection4 } from "./utils/mathUtils";

export const actions = ["idle", "walk"] as const;
export type Action = (typeof actions)[number];

const generatePostUpdateWalk = (minion: Minion) => {
	return () => {
		if (minion.pos.distance(minion.state().destination) < 5) {
			const { walk, ...postUpdates } = minion.state().postUpdates;
			minion.vel = Vector.Zero;
			minion.setState((prev) => ({
				...prev,
				action: "idle",
				postUpdates,
			}));
		}
	};
};

// const generatePostUpdateWalk = (
// 	player: Awaited<ReturnType<typeof createMinion>>
// ) => {
// 	return () => {
// 		if (player.actor.pos.distance(player.state().destination) < 5) {
// 			const { walk, ...postUpdates } = player.state().postUpdates;
// 			player.actor.vel = Vector.Zero;
// 			player.setState((prev) => ({
// 				...prev,
// 				action: "idle",
// 				postUpdates,
// 			}));
// 		}
// 	};
// };

export const handleWalk = (minion: Minion, destination: Vector) => {
	const pointerVec = destination.sub(minion.pos).normalize();
	minion.vel = pointerVec.clone().scale(100);
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

// export const handleWalk = (
// 	player: Awaited<ReturnType<typeof createMinion>>,
// 	destination: Vector
// ) => {
// 	const pointerVec = destination.sub(player.actor.pos).normalize();
// 	player.actor.vel = pointerVec.clone().scale(100);
// 	player.setState((prev) => ({
// 		...prev,
// 		action: "walk",
// 		direction: getDirection4(pointerVec),
// 		destination,
// 		postUpdates: {
// 			...prev.postUpdates,
// 			walk: generatePostUpdateWalk(player),
// 		},
// 	}));
// };
