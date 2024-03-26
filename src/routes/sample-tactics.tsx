import { clientOnly } from "@solidjs/start";

const ClientOnlyGame = clientOnly(
	() => import("~/components/sampleTactics/Entry")
);
export default function SampleTactics() {
	return <ClientOnlyGame />;
}
