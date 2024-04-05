import { type Accessor } from "solid-js";
import { Progress } from "~/components/ui/progress";
import { type Actor, type Engine } from "excalibur";
import { getUiPosByTopLeft } from "../../utils/UiUtils";
import { type ResourceState } from "./Harvestable";

export const HarvestableAboveBars = (props: {
	state: Accessor<ResourceState>;
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
			{props.state().amountRemaining < props.state().maxAmount && (
				<Progress
					value={props.state().amountRemaining}
					minValue={0}
					maxValue={props.state().maxAmount}
					style={{
						width: `${props.actor.width}px`,
					}}
					color="bg-lime-500"
				/>
			)}
		</div>
	);
};
