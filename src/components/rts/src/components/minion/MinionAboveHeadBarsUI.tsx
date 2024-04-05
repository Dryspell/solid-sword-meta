import { type Accessor } from "solid-js";
import { type UnitState } from "./Minion";
import { Progress } from "~/components/ui/progress";
import { type Actor, type Engine } from "excalibur";
import { getUiPosByTopLeft } from "../../utils/UiUtils";
import { isSelectable } from "../SelectableActor";

export const MinionAboveHeadBars = (props: {
	state: Accessor<UnitState>;
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
					value={props.state().hp}
					minValue={0}
					maxValue={props.state().maxHp}
					style={{
						width: `${props.actor.width}px`,
					}}
					color="bg-red-500"
				/>
			)}
			{props.state().action === "harvest" && (
				<Progress
					value={props.state().work}
					minValue={0}
					maxValue={props.state().harvestWork}
					style={{
						width: `${props.actor.width}px`,
					}}
					color="bg-yellow-500"
				/>
			)}
		</div>
	);
};
