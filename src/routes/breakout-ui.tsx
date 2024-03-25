import { clientOnly } from "@solidjs/start";

const ClientOnlyGame = clientOnly(() => import("~/components/breakoutUIGame"));
export default function Breakout() {
	return <ClientOnlyGame />;
}
