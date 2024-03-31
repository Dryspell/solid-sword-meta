import { Actor, Circle, Color, type Engine, Line, Vector } from "excalibur";
import { type Accessor, createEffect } from "solid-js";
import { type State } from "./Minion";

export class DestinationIndicator extends Actor {
	lineGraphic: Line;
	line: Actor;
	circleGraphic: Circle;
	targetCircle: Actor;

	constructor(state: Accessor<State>) {
		super({
			pos: state().pos,
			anchor: Vector.Half,
		});

		const lineGraphic = new Line({
			start: Vector.Zero,
			end: state().destination.sub(this.pos),
			color: Color.Green,
			thickness: 2,
		});
		this.lineGraphic = lineGraphic;
		this.line = new Actor({
			pos: state().pos,
			anchor: Vector.Zero,
		});

		const circleGraphic = new Circle({
			radius: 5,
			color: Color.Red,
		});
		this.circleGraphic = circleGraphic;
		this.targetCircle = new Actor({
			pos: state().destination,
			anchor: Vector.Half,
		});
		this.targetCircle.graphics.add("circle", circleGraphic);

		createEffect(() => {
			this.pos = state().pos;
			this.line.pos = state().pos;
			this.lineGraphic = new Line({
				start: Vector.Zero,
				end: state().destination.sub(this.pos),
				color: Color.Green,
				thickness: 2,
			});
			this.line.graphics.add("line", this.lineGraphic);
			this.targetCircle.pos = state().destination;
		});
	}

	onInitialize(engine: Engine<any>): void {
		engine.add(this.line);
		engine.add(this.targetCircle);
	}

	hide() {
		this.targetCircle.graphics.hide();
		this.line.graphics.hide();
	}

	show() {
		this.targetCircle.graphics.use("circle");
		this.line.graphics.use("line");
	}
}
