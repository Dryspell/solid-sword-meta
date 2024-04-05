import {
	type Collider,
	type CollisionContact,
	type Side,
	Vector,
} from "excalibur";
import { type Minion } from "./Minion";
import { getDirection4 } from "../../utils/mathUtils";
import { type HarvestableResource } from "../harvestable/Harvestable";

export const actions = ["idle", "walk", "harvest"] as const;
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
		} else {
			minion.graphics.use(
				`${minion.state().action}_${minion.state().direction}`
			);

			const pointerVec = minion
				.state()
				.destination.sub(minion.pos)
				.normalize();
			minion.vel = pointerVec.clone().scale(100);
			minion.setState((prev) => ({
				...prev,
				pos: minion.pos,
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

export const harvestResource = (
	resource: HarvestableResource,
	minions: Minion[]
) => {
	minions.forEach((minion, i) => {
		const pointerVec = resource.pos.clone().sub(minion.pos).normalize();
		minion.vel = pointerVec.clone().scale(100);
		minion.destinationIndicator.show();
		minion.setState((prev) => ({
			...prev,
			action: "walk",
			direction: getDirection4(pointerVec),
			destination: resource.pos.clone(),
			postUpdates: {
				...prev.postUpdates,
				walk: generatePostUpdateWalk(minion),
			},
			collisionActions: {
				harvest: (
					self: Collider,
					other: Collider,
				) => {
					console.log(other.owner);
					if (other.owner === resource) {
						console.log("harvesting");
						minion.vel = Vector.Zero;
						minion.destinationIndicator.hide();
						const { walk, ...postUpdates } =
							minion.state().postUpdates;
						minion.setState((prev) => ({
							...prev,
							work: 0,
							harvestWork: resource.harvestWork,
							action: "harvest",
							postUpdates: {
								...postUpdates,
								harvest: () => {
									if (
										minion.state().work >=
										resource.harvestWork
									) {
										resource.setState((prev) => ({
											...prev,
											amountRemaining:
												prev.amountRemaining - 1,
										}));
										minion.setState((prev) => ({
											...prev,
											work: 0,
										}));
									} else
										minion.setState((prev) => ({
											...prev,
											work: prev.work + 1,
										}));
								},
							},
						}));
					}
				},
			},
		}));
	});
};
