import { Actor, Color, Engine, Line, vec, Vector } from "excalibur";

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
