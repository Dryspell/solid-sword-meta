import { vec, Vector } from "excalibur";
import { getDimensions } from "./graphicsUtils";

export const directions = ["up", "right", "down", "left"] as const;
export type Direction = (typeof directions)[number];
export const diagonals = [
	"up-right",
	"down-right",
	"down-left",
	"up-left",
] as const;
export type Diagonal = (typeof diagonals)[number];

export const getDirection4 = (pointerVec: Vector) => {
	const angle = pointerVec.toAngle();

	return angle <= Math.PI / 4 && angle >= -Math.PI / 4
		? "right"
		: angle >= (3 * -Math.PI) / 4 && angle <= -Math.PI / 4
		? "up"
		: angle >= (3 * Math.PI) / 4 || angle <= (3 * -Math.PI) / 4
		? "left"
		: "down";
};

export const getDirection8 = (pointerVec: Vector) => {
	const directionVec = pointerVec.clone().scale(vec(1, -1));
	console.log({ directionVec: JSON.stringify(directionVec) });

	const angle = directionVec.toAngle();

	const index =
		(Math.round(((angle + Math.PI / 8) % (2 * Math.PI)) / (Math.PI / 4)) +
			8) %
		8;
	return index % 2 === 0 ? directions[index / 2] : diagonals[(index - 1) / 2];
};

export const isWithinRect = (
	pos: Vector,
	dimensions: ReturnType<typeof getDimensions>
) => {
	return (
		((pos.x >= dimensions.x0 && pos.x <= dimensions.x1) ||
			(pos.x <= dimensions.x0 && pos.x >= dimensions.x1)) &&
		((pos.y >= dimensions.y0 && pos.y <= dimensions.y1) ||
			(pos.y <= dimensions.y0 && pos.y >= dimensions.y1))
	);
};
