import { Actor, Engine, Loader, SpriteSheet, vec } from "excalibur";

export function showSpriteSheet(
	game: Engine,
	spriteSheet: SpriteSheet,
	spriteSheet_COLUMNS: number,
	spriteSheet_ROWS: number
) {
	const SPACING_MULTIPLIER = 2;
	const SPACING = 16;

	const sprites = Array.from({ length: 12 }).map((_, column) => {
		return Array.from({ length: 21 }).map((_, row) => {
			const spriteActor = new Actor({
				pos: vec(
					(column + 1) * SPACING * SPACING_MULTIPLIER,
					(row + 1) * SPACING * SPACING_MULTIPLIER
				),
			});
			spriteActor.graphics.use(spriteSheet.getSprite(column, row));
			game.add(spriteActor);

			return spriteActor;
		});
	});

	console.log({ sprites });
}
