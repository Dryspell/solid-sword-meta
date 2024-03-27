import { clientOnly } from "@solidjs/start";

const ClientOnlyGame = clientOnly(() => import("~/components/drawing/Entry"));
export default function Drawing() {
	// return <div>Breakout</div>;
	return <ClientOnlyGame />;
}
