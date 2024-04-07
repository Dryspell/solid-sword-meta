import { type Accessor } from "solid-js";
import { type Minion, type UnitState } from "./Minion";
import { Progress } from "~/components/ui/progress";
import { type Actor, type Engine } from "excalibur";
import { getUiPosByTopLeft } from "../../utils/UiUtils";
import { isSelectable } from "../SelectableActor";
import { Label } from "~/components/ui/label";

export const MinionOverlayUI = (props: {
	state: Accessor<UnitState>;
	actor: Minion;
	engine: Engine;
}) => {
	return (
		<>
			{props.state().hp > 0 && !props.actor.isKilled() && (
				<>
					<div
						style={{
							position: "absolute",
							top: `${
								getUiPosByTopLeft(
									props.state().pos,
									props.engine
								).top -
								2.5 * props.actor.height
							}px`,
							left: `${
								getUiPosByTopLeft(
									props.state().pos,
									props.engine
								).left -
								props.actor.width / 2
							}px`,
						}}
					>
						{((isSelectable(props.actor) &&
							props.actor.selected()) ||
							props.state().action === "combat" ||
							props.state().hp < props.state().maxHp) && (
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
						{props.state().action === "combat" && (
							<Progress
								value={props.state().attackProgress}
								minValue={0}
								maxValue={props.state().attackSpeed}
								style={{
									width: `${props.actor.width}px`,
								}}
								color="bg-purple-500"
							/>
						)}
					</div>
					<div
						style={{
							position: "absolute",
							top: `${
								getUiPosByTopLeft(
									props.state().pos,
									props.engine
								).top -
								props.actor.height / 2
							}px`,
							left: `${
								getUiPosByTopLeft(
									props.state().pos,
									props.engine
								).left -
								props.actor.width / 2
							}px`,
						}}
					>
						{isSelectable(props.actor) &&
							props.actor.selected() && (
							<Label
								class={`text-[${props.actor.owner.teamColor.toString(
									"hex"
								)}] justify-self-auto`}
							>
								{props.actor.name}
							</Label>
						)}
					</div>
				</>
			)}
		</>
	);
};
