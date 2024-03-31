import { type Accessor } from "solid-js";
import { type UnitMenuData } from "../ui-manager";
import styles from "./UnitMenu.module.css";

export default function UnitMenu(props: {
	unitMenuData: Accessor<UnitMenuData>;
}) {
	return (
		<>
			{/* <div class={styles.overlay}></div> */}
			<div
				class={`${styles.menu} ${
					props.unitMenuData().show ? styles.show : ""
				}`}
				style={{
					left: `${props.unitMenuData().left}px`,
					top: `${props.unitMenuData().top}px`,
				}}
			>
				<div class={styles.titleBar}></div>
				<div class={styles.options}>
					<button
						class={styles.button}
						onClick={() => {
							props.unitMenuData().move();
						}}
						style={{
							display: props.unitMenuData().unit?.canMove()
								? "block"
								: "none",
						}}
					>
						Move
					</button>
					<button
						class={styles.button}
						onClick={() => {
							props.unitMenuData().attack();
						}}
						style={{
							display: props.unitMenuData().unit?.canAttack()
								? "block"
								: "none",
						}}
					>
						Attack
					</button>
					<button
						class={styles.button}
						onClick={() => {
							props.unitMenuData().pass();
						}}
					>
						Done
					</button>
				</div>
			</div>
		</>
	);
}
