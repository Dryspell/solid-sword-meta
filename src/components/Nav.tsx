import { useLocation } from "@solidjs/router";

export default function Nav() {
	const location = useLocation();
	const active = (path: string) =>
		path == location.pathname
			? "border-sky-600"
			: "border-transparent hover:border-sky-600";
	return (
		<nav class="bg-sky-800">
			<ul class="container flex items-center p-3 text-gray-200">
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
					<a href="/">Home</a>
				</li>
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
					<a href="/breakout">Breakout</a>
				</li>
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
					<a href="/breakout-ui">Breakout with UI</a>
				</li>
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
					<a href="/sample-tactics">Sample Tactics</a>
				</li>
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
					<a href="/sample-tactics-refactor">
						Sample Tactics Refactor
					</a>
				</li>
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
					<a href="/drawing">Drawing</a>
				</li>
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
					<a href="/rts">RTS Box</a>
				</li>
			</ul>
		</nav>
	);
}
