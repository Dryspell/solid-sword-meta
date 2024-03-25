import { clientOnly } from "@solidjs/start";

const ClientOnlyGame = clientOnly(() => import("~/components/breakoutGame"));
export default function Breakout() {
	return <ClientOnlyGame />;
}
