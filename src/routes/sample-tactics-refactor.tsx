import { clientOnly } from "@solidjs/start";

const ClientOnlyGame = clientOnly(
	() => import("~/components/SampleTacticsRefactor/Entry")
);
export default function SampleTactics() {
	return <ClientOnlyGame />;
}
