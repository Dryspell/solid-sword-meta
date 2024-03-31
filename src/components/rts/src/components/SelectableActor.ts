import { Actor, ActorArgs, Entity } from "excalibur";
import { Accessor, createEffect, createSignal, Setter } from "solid-js";

export const isSelectable = (entity: Entity): entity is SelectableActor => {
	return entity instanceof SelectableActor;
};

export class SelectableActor extends Actor {
	public selected: Accessor<boolean>;
	public setSelected: Setter<boolean>;

	constructor(config?: ActorArgs) {
		super(config);
		const [selected, setSelected] = createSignal(false);
		this.selected = selected;
		this.setSelected = setSelected;

		createEffect(() => {
			if (this.selected()) {
				console.log(`Selected`, this);
			}
		});

		this.addTag("selectable");
	}
}

const selectableActor = new SelectableActor({});
