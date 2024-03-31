import {
	Actor,
	Color,
	type Engine,
	GraphicsGroup,
	Line,
	vec,
	Vector,
} from "excalibur";
import { createSignal } from "solid-js";
import { isSelectable } from "./SelectableActor";
import { isWithinRect } from "../utils/mathUtils";

export const getDimensions = (selectionRect: Actor, lines: Line[]) => {
	return {
		x0: selectionRect.pos.x,
		y0: selectionRect.pos.y,
		x1: selectionRect.pos.x + lines[2].start.x,
		y1: selectionRect.pos.y + lines[2].start.y,
	};
};

export const generateSelectionRect = (game: Engine) => {
	const [isDragging, setIsDragging] = createSignal(false);

	const lines = [
		new Line({
			start: vec(0, 0),
			end: vec(100, 0),
			color: Color.Green,
			thickness: 2,
		}),
		new Line({
			start: vec(100, 0),
			end: vec(100, 100),
			color: Color.Green,
			thickness: 2,
		}),
		new Line({
			start: vec(100, 100),
			end: vec(0, 100),
			color: Color.Green,
			thickness: 2,
		}),
		new Line({
			start: vec(0, 100),
			end: vec(0, 0),
			color: Color.Green,
			thickness: 2,
		}),
	];

	const rect = new GraphicsGroup({
		members: lines,
	});

	const selectionRect = new Actor({
		pos: vec(0, 0),
		anchor: Vector.Zero,
	});
	selectionRect.graphics.add("rect", rect);

	const setDimensions = (start: Vector, end: Vector) => {
		lines[0] = new Line({
			start: vec(0, 0),
			end: vec(end.x - start.x, 0),
			color: Color.Green,
			thickness: 2,
		});
		lines[1] = new Line({
			start: vec(end.x - start.x, 0),
			end: vec(end.x - start.x, end.y - start.y),
			color: Color.Green,
			thickness: 2,
		});
		lines[2] = new Line({
			start: vec(end.x - start.x, end.y - start.y),
			end: vec(0, end.y - start.y),
			color: Color.Green,
			thickness: 2,
		});
		lines[3] = new Line({
			start: vec(0, end.y - start.y),
			end: vec(0, 0),
			color: Color.Green,
			thickness: 2,
		});
	};

	game.add(selectionRect);

	game.input.pointers.on("down", (pointerEvent) => {
		if (pointerEvent.button === "Left") {
			setIsDragging(true);
			selectionRect.pos = pointerEvent.coordinates.worldPos;
		}
	});

	game.input.pointers.on("move", (pointerEvent) => {
		if (isDragging()) {
			setDimensions(selectionRect.pos, pointerEvent.coordinates.worldPos);
			selectionRect.graphics.use(rect);
		}
	});

	game.input.pointers.on("up", (pointerEvent) => {
		if (pointerEvent.button === "Left") {
			setIsDragging(false);
			selectionRect.graphics.hide();
			const selectedActors = game.currentScene.world
				.queryTags(["selectable"])
				.entities.filter((ent) => {
					if (!isSelectable(ent)) return false;
					const dimensions = getDimensions(selectionRect, lines);

					const withinRect = isWithinRect(ent.pos, dimensions);
					if (withinRect) {
						ent.setSelected(true);
					} else {
						ent.setSelected(false);
					}
					return isWithinRect(ent.pos, dimensions);
				});
			console.log({ selectedActors });
		}
	});

	return {
		selectionRect,
		rect,
		setDimensions,
		getDimensions: () => getDimensions(selectionRect, lines),
		isDragging,
		setIsDragging,
	};
};
