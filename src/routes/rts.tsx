import { clientOnly } from "@solidjs/start";

const ClientOnlyGame = clientOnly(() => import("~/components/rts/Entry"));
export default function RTS() {
	// return <div>Breakout</div>;
	return <ClientOnlyGame />;
}
