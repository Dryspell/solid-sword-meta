import { type Collider, Vector } from "excalibur";
import { type Minion } from "./Minion";
import { getDirection4 } from "../../utils/mathUtils";
import { type HarvestableResource } from "../harvestable/Harvestable";

export const actions = ["idle", "walk", "harvest", "combat"] as const;
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

const setMinionHarvestState = (
	minion: Minion,
	resource: HarvestableResource
) => {
	minion.vel = Vector.Zero;
	minion.destinationIndicator.hide();
	minion.setState((prev) => ({
		...prev,
		work: 0,
		harvestWork: resource.harvestWork,
		action: "harvest",
		collisionActions: {},
		postUpdates: {
			harvest: () => {
				if (resource.isKilled()) {
					minion.setState((prev) => ({
						...prev,
						action: "idle",
						work: 0,
						harvestWork: 1,
						postUpdates: {},
					}));
					minion.graphics.use(
						`${minion.state().action}_${minion.state().direction}`
					);
					return;
				}

				if (minion.state().work >= resource.harvestWork) {
					if (resource.state().amountRemaining > 0) {
						resource.setState((prev) => ({
							...prev,
							amountRemaining: prev.amountRemaining - 1,
						}));
						minion.setState((prev) => ({
							...prev,
							work: 0,
						}));
					} else {
						resource.kill();
						minion.setState((prev) => ({
							...prev,
							action: "idle",
							work: 0,
							harvestWork: 1,
							postUpdates: {},
						}));
						minion.graphics.use(
							`${minion.state().action}_${
								minion.state().direction
							}`
						);
					}
				} else
					minion.setState((prev) => ({
						...prev,
						work: prev.work + 1,
					}));
			},
		},
	}));
	minion.graphics.use(`${minion.state().action}_${minion.state().direction}`);
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
				walk: generatePostUpdateWalk(minion),
			},
			collisionActions: {
				harvest: (self: Collider, other: Collider) => {
					if (other.owner === resource) {
						setMinionHarvestState(minion, resource);
					}
				},
			},
		}));
	});
};

const setMinionCombatState = (minion: Minion, targetEnemyMinion: Minion) => {
	minion.vel = Vector.Zero;
	minion.destinationIndicator.hide();
	minion.setState((prev) => ({
		...prev,
		work: 0,
		attackProgress: 0,
		action: "combat",
		collisionActions: {},
		postUpdates: {
			attack: () => {
				if (
					minion.pos.distance(targetEnemyMinion.pos) >
					minion.state().attackRange
				) {
					enterCombat(targetEnemyMinion, [minion]);
					return;
				}
				if (targetEnemyMinion.isKilled()) {
					minion.setState((prev) => ({
						...prev,
						action: "idle",
						work: 0,
						harvestWork: 1,
						postUpdates: {},
					}));
					minion.graphics.use(
						`${minion.state().action}_${minion.state().direction}`
					);
					return;
				}

				if (
					minion.state().attackProgress >= minion.state().attackSpeed
				) {
					if (targetEnemyMinion.state().hp > 0) {
						targetEnemyMinion.setState((prev) => ({
							...prev,
							hp:
								prev.hp -
								Math.round(
									Math.random() *
										(minion.state().attackDamage[1] -
											minion.state().attackDamage[0]) +
										minion.state().attackDamage[0]
								),
						}));
						minion.setState((prev) => ({
							...prev,
							attackProgress: 0,
						}));
					} else {
						targetEnemyMinion.kill();
						minion.setState((prev) => ({
							...prev,
							action: "idle",
							attackProgress: 0,
							postUpdates: {},
						}));
						minion.graphics.use(
							`${minion.state().action}_${
								minion.state().direction
							}`
						);
					}
				} else
					minion.setState((prev) => ({
						...prev,
						attackProgress: prev.attackProgress + 1,
					}));
			},
		},
	}));
	minion.graphics.use(`${minion.state().action}_${minion.state().direction}`);
};

export const enterCombat = (targetEnemyMinion: Minion, minions: Minion[]) => {
	minions.forEach((minion, i) => {
		const pointerVec = targetEnemyMinion.pos
			.clone()
			.sub(minion.pos)
			.normalize();
		minion.vel = pointerVec.clone().scale(100);
		minion.destinationIndicator.show();
		minion.setState((prev) => ({
			...prev,
			action: "walk",
			direction: getDirection4(pointerVec),
			destination: targetEnemyMinion.pos.clone(),
			postUpdates: {
				walk: generatePostUpdateWalk(minion),
			},
			collisionActions: {
				combat: (self: Collider, other: Collider) => {
					if (other.owner === targetEnemyMinion) {
						if (targetEnemyMinion.state().action !== "combat") {
							setMinionCombatState(targetEnemyMinion, minion);
						}

						setMinionCombatState(minion, targetEnemyMinion);
					}
				},
			},
		}));
	});
};
