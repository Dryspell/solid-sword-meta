import { Accessor, createEffect, createSignal, Setter } from "solid-js";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuGroupLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { State } from "../minion";
import { Progress } from "~/components/ui/progress";
import { Actor, Engine } from "excalibur";
import { getUiPosByTopLeft } from "../utils/UiUtils";

export const ButtonUI = ({
	state,
	setState,
}: {
	state: Accessor<State>;
	setState: Setter<State>;
}) => {
	const buttonStyle = {
		padding: "1rem",
		margin: "1rem",
	};

	return (
		<div
			style={{
				position: "absolute",
				top: "0px",
				right: "0px",
				padding: "1rem",
			}}
		>
			{/* <Button
				onClick={() => {
					dispose();
				}}
			>
				Dispose
			</Button> */}
			<div>
				<DropdownMenu>
					<DropdownMenuTrigger as={Button}>
						Select Action
					</DropdownMenuTrigger>
					<DropdownMenuGroup>
						<DropdownMenuGroupLabel>Action</DropdownMenuGroupLabel>
						<DropdownMenuRadioGroup
							value={state().action}
							onChange={(value) =>
								setState((prev) => ({
									...prev,
									action: value as "idle" | "walk",
								}))
							}
						>
							<DropdownMenuRadioItem value="idle">
								idle
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="walk">
								walk
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuGroup>
				</DropdownMenu>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "up",
						}))
					}
				>
					Up
				</Button>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "down",
						}))
					}
				>
					Down
				</Button>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "left",
						}))
					}
				>
					Left
				</Button>
				<Button
					style={buttonStyle}
					onClick={() =>
						setState((prev) => ({
							...prev,
							direction: "right",
						}))
					}
				>
					Right
				</Button>
			</div>
		</div>
	);
};

export const HealthBarUI = ({
	state,
	actor,
	engine,
}: {
	state: Accessor<State>;
	actor: Actor;
	engine: Engine;
}) => {
	return (
		<div
			style={{
				position: "absolute",
				top: `${
					getUiPosByTopLeft(state().pos, engine).top -
					2 * actor.height
					// state().pos.y
					//getUiPosByTopLeft(actor.pos, engine).top
				}px`,
				left: `${
					getUiPosByTopLeft(state().pos, engine).left -
					actor.width / 2
					// state().pos.x
					// getUiPosByTopLeft(actor.pos, engine).top
				}px`,
				border: "1px solid black",
			}}
		>
			{/* <Button>Hello</Button> */}
			<Progress
				value={60}
				minValue={0}
				maxValue={100}
				style={{
					width: `${actor.width}px`,
				}}
			/>
		</div>
	);
};
