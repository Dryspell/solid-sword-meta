import { Engine, vec, Vector } from "excalibur";
import { SCALE } from "../config";
import { Unit } from "../unit";

export function worldDistanceToPage(distance: number, engine: Engine) {
	const pageOrigin = engine.screen.worldToPageCoordinates(Vector.Zero);
	const pageDistance = engine.screen
		.worldToPageCoordinates(vec(distance * SCALE.x, 0))
		.sub(pageOrigin);
	return pageDistance.x;
}

export function getUnitMenuPosition(unit: Unit, engine: Engine) {
	const pagePos = engine.screen.worldToPageCoordinates(unit.pos);
	return {
		left: pagePos.x + worldDistanceToPage(32, engine),
		top: pagePos.y,
	};
}
