import { Accessor } from "solid-js";
import { UnitMenuData } from "../ui-manager";
import styles from "./UnitMenu.module.css";

export default function UnitMenu({
	unitMenuData,
}: {
	unitMenuData: Accessor<UnitMenuData>;
}) {
	return (
		<>
			{/* <div class={styles.overlay}></div> */}
			<div
				class={`${styles.menu} ${
					unitMenuData().show ? styles.show : ""
				}`}
				style={{
					left: `${unitMenuData().left}px`,
					top: `${unitMenuData().top}px`,
				}}
			>
				<div class={styles.titleBar}></div>
				<div class={styles.options}>
					<button
						class={styles.button}
						onClick={() => {
							unitMenuData().move();
						}}
						style={{
							display: unitMenuData().unit?.canMove()
								? "block"
								: "none",
						}}
					>
						Move
					</button>
					<button
						class={styles.button}
						onClick={() => {
							unitMenuData().attack();
						}}
						style={{
							display: unitMenuData().unit?.canAttack()
								? "block"
								: "none",
						}}
					>
						Attack
					</button>
					<button
						class={styles.button}
						onClick={() => {
							unitMenuData().pass();
						}}
					>
						Done
					</button>
				</div>
			</div>
		</>
	);
}
