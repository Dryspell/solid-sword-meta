import { clientOnly } from "@solidjs/start";

const ClientOnlyGame = clientOnly(
	() => import("~/components/MinimalSprite/Entry")
);
export default function SampleTactics() {
	return <ClientOnlyGame />;
}
