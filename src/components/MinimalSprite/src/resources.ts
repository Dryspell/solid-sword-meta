import * as ex from "excalibur";
import KnightSpriteSheetPath from "../res/KnightSheet.png";

export const SCALE = ex.vec(3, 3);

export const Resources = {
	KnightSpriteSheet: new ex.ImageSource(KnightSpriteSheetPath),
} as const;

export const KnightSpriteSheet = ex.SpriteSheet.fromImageSource({
	image: Resources.KnightSpriteSheet,
	grid: {
		rows: 1,
		columns: 4,
		spriteHeight: 32,
		spriteWidth: 32,
	},
});

export const KnightIdle = ex.Animation.fromSpriteSheetCoordinates({
	spriteSheet: KnightSpriteSheet,
	strategy: ex.AnimationStrategy.Loop,
	frameCoordinates: [
		{ x: 0, y: 0, duration: 200 },
		{ x: 1, y: 0, duration: 200 },
		{ x: 2, y: 0, duration: 200 },
		{ x: 3, y: 0, duration: 200 },
	],
});

export const loader = new ex.Loader();

for (let res of Object.values(Resources)) {
	loader.addResource(res);
}
