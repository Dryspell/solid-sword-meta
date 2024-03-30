import { Actor, Entity } from "excalibur";

export function isActor(x: Entity): x is Actor {
	return x instanceof Actor;
}
