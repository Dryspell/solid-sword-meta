import * as ex from "excalibur";

import { SCALE } from "./config";
import { Unit } from "./unit";
import { Accessor, createSignal, Setter } from "solid-js";
import { render } from "solid-js/web";
import UnitMenu from "./ui-components/UnitMenu";
import { gameUiId } from "../Entry";

export interface MenuOptions {
	move: () => any;
	attack: () => any;
	pass: () => any;
}

const defaultMenuOptions: MenuOptions = {
	move: () => {
		console.log("default move");
	},
	attack: () => {
		console.log("default attack");
	},
	pass: () => {
		console.log("default pass");
	},
};

export type UnitMenuData = {
	worldPos?: ex.Vector;
	left?: number;
	top?: number;
	fontSize?: number;
	width?: number;
	unit?: Unit | null;
	pixelConversion?: number;
	show?: boolean;
	menuHtml?: HTMLDivElement;
} & MenuOptions;
/**
 * UI manager create html elements for game UI
 */
export class UIManager {
	unitMenuData: Accessor<UnitMenuData>;
	setUnitMenuData: Setter<UnitMenuData>;

	constructor(private engine: ex.Engine) {
		const [unitMenuData, setUnitMenuData] = createSignal<UnitMenuData>({
			...defaultMenuOptions,
		});
		this.unitMenuData = unitMenuData;
		this.setUnitMenuData = setUnitMenuData;

		document.documentElement.style.setProperty(
			"--pixel-conversion",
			this.worldDistanceToPage(1).toString()
		);
		window.addEventListener("resize", () => {
			document.documentElement.style.setProperty(
				"--pixel-conversion",
				this.worldDistanceToPage(1).toString()
			);

			const menuPos = unitMenuData().worldPos;
			if (menuPos) {
				const pagePos =
					this.engine.screen.worldToPageCoordinates(menuPos);
				setUnitMenuData((prev) => ({
					...prev,
					left: pagePos.x + this.worldDistanceToPage(32),
					top: pagePos.y,
				}));
			}
		});

		render(
			() => <UnitMenu unitMenuData={unitMenuData} />,
			document.getElementById(gameUiId)!
		);
	}

	worldDistanceToPage(distance: number) {
		const pageOrigin = this.engine.screen.worldToPageCoordinates(
			ex.Vector.Zero
		);
		const pageDistance = this.engine.screen
			.worldToPageCoordinates(ex.vec(distance * SCALE.x, 0))
			.sub(pageOrigin);
		return pageDistance.x;
	}

	dismissAll() {
		this.setUnitMenuData((prev) => ({
			...prev,
			show: false,
		}));
	}

	showUnitMenu(unit: Unit, options: MenuOptions) {
		const pagePos = this.engine.screen.worldToPageCoordinates(unit.pos);
		this.setUnitMenuData((prev) => ({
			...prev,
			show: true,
			left: pagePos.x + this.worldDistanceToPage(32),
			top: pagePos.y,
			unit,
			...options,
			worldPos: unit.pos,
		}));
	}

	showNextMission(pos: ex.Vector) {}
}
