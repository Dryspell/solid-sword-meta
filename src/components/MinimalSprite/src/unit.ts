import * as ex from "excalibur";
import { KnightIdle, SCALE } from "./resources";

export class Unit extends ex.Actor {
	anim: ex.Animation;

	constructor(x: number, y: number) {
		super({
			anchor: ex.vec(0, 0),
			z: 2,
		});

		this.anim = KnightIdle.clone();
		this.anim.scale = SCALE;
		this.graphics.use(this.anim);
	}
}
