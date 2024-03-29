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
import { State } from "./player";


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
