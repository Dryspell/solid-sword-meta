import { Vector } from "excalibur";
import { createPlayer } from "./player";
import { getDirection4 } from "./mathUtils";

export const actions = ["idle", "walk"] as const;
export type Action = (typeof actions)[number];

const generatePostUpdateWalk = (
	player: Awaited<ReturnType<typeof createPlayer>>
) => {
	return () => {
		if (player.actor.pos.distance(player.state().destination) < 5) {
			const { walk, ...postUpdates } = player.state().postUpdates;
			player.actor.vel = Vector.Zero;
			player.setState((prev) => ({
				...prev,
				action: "idle",
				postUpdates,
			}));
		}
	};
};

export const handleWalk = (
	player: Awaited<ReturnType<typeof createPlayer>>,
	destination: Vector
) => {
	const pointerVec = destination.sub(player.actor.pos).normalize();
	player.actor.vel = pointerVec.clone().scale(100);
	player.setState((prev) => ({
		...prev,
		action: "walk",
		direction: getDirection4(pointerVec),
		destination,
		postUpdates: {
			...prev.postUpdates,
			walk: generatePostUpdateWalk(player),
		},
	}));
};
