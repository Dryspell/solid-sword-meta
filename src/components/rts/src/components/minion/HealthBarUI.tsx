import { type Accessor } from "solid-js";
import { type State } from "./Minion";
import { Progress } from "~/components/ui/progress";
import { type Actor, type Engine } from "excalibur";
import { getUiPosByTopLeft } from "../../utils/UiUtils";
import { isSelectable } from "../SelectableActor";

export const HealthBarUI = (props: {
	state: Accessor<State>;
	actor: Actor;
	engine: Engine;
}) => {
	return (
		<div
			style={{
				position: "absolute",
				top: `${
					getUiPosByTopLeft(props.state().pos, props.engine).top -
					2.5 * props.actor.height
				}px`,
				left: `${
					getUiPosByTopLeft(props.state().pos, props.engine).left -
					props.actor.width / 2
				}px`,
			}}
		>
			{isSelectable(props.actor) && props.actor.selected() && (
				<Progress
					value={60}
					minValue={0}
					maxValue={100}
					style={{
						width: `${props.actor.width}px`,
					}}
				/>
			)}
		</div>
	);
};
