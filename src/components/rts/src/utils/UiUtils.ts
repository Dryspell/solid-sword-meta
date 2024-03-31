import { Actor, type Engine, vec, Vector } from "excalibur";
export const SCALE = vec(3, 3);

export function worldDistanceToPage(distance: number, engine: Engine) {
	const pageOrigin = engine.screen.worldToPageCoordinates(Vector.Zero);
	const pageDistance = engine.screen
		.worldToPageCoordinates(vec(distance * SCALE.x, 0))
		.sub(pageOrigin);
	return pageDistance.x;
}

export function getUiPosByTopLeft(pos: Vector, engine: Engine) {
	const pagePos = engine.screen.worldToPageCoordinates(pos);
	return {
		left: pagePos.x, //+ worldDistanceToPage(32, engine),
		top: pagePos.y,
	};
}
