import type { Component } from "solid-js";
import { splitProps } from "solid-js";

import { Progress as ProgressPrimitive } from "@kobalte/core";

import { Label } from "~/components/ui/label";

const Progress: Component<
	ProgressPrimitive.ProgressRootProps & { color: string }
> = (props) => {
	const [, rest] = splitProps(props, ["children"]);
	return (
		<ProgressPrimitive.Root {...rest}>
			{props.children}
			<ProgressPrimitive.Track class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
				<ProgressPrimitive.Fill
					class={`h-full w-[var(--kb-progress-fill-width)] flex-1 ${props.color} transition-all`}
				/>
			</ProgressPrimitive.Track>
		</ProgressPrimitive.Root>
	);
};

const ProgressLabel: Component<ProgressPrimitive.ProgressLabelProps> = (
	props
) => {
	return <ProgressPrimitive.Label as={Label} {...props} />;
};

const ProgressValueLabel: Component<
	ProgressPrimitive.ProgressValueLabelProps
> = (props) => {
	return <ProgressPrimitive.ValueLabel as={Label} {...props} />;
};

export { Progress, ProgressLabel, ProgressValueLabel };
