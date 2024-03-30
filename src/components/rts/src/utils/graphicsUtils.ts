import {
	Actor,
	Color,
	Engine,
	GraphicsGroup,
	Line,
	Rectangle,
	vec,
	Vector,
} from "excalibur";

export const drawLine = (
	game: Engine,
	start: Vector,
	end: Vector,
	color = Color.Green,
	thickness = 10
) => {
	const lineActor = new Actor({
		pos: vec(0, 0),
	});
	lineActor.graphics.anchor = Vector.Zero;
	lineActor.graphics.use(
		new Line({
			start,
			end,
			color,
			thickness,
		})
	);
	game.add(lineActor);
};

export const generateFilledRect = (game: Engine) => {
	const rect = new Rectangle({
		width: 100,
		height: 100,
		color: Color.Green,
		lineWidth: 2,
	});

	const selectionRect = new Actor({
		pos: vec(0, 0),
		anchor: Vector.Zero,
	});
	selectionRect.graphics.add("rect", rect);

	const setDimensions = (start: Vector, end: Vector) => {
		selectionRect.anchor.x = start.x > end.x ? 1 : 0;
		selectionRect.anchor.y = start.y > end.y ? 1 : 0;

		const width = Math.abs(start.x - end.x);
		const height = Math.abs(start.y - end.y);
		rect.width = width;
		rect.height = height;
	};

	game.add(selectionRect);

	return { selectionRect, rect, setDimensions };
};

export const getDimensions = (selectionRect: Actor, lines: Line[]) => {
	return {
		x0: selectionRect.pos.x,
		y0: selectionRect.pos.y,
		x1: selectionRect.pos.x + lines[2].start.x,
		y1: selectionRect.pos.y + lines[2].start.y,
	};
};

export const generateSelectionRect = (game: Engine) => {
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

	return {
		selectionRect,
		rect,
		setDimensions,
		getDimensions: () => getDimensions(selectionRect, lines),
	};
};
