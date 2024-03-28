import { ImageFiltering, ImageSource, Loader } from "excalibur";

import FemaleCharacterSpriteSheet from "../res/female_char/SpriteSheet.png";

export const Resources = {
	FemaleCharacterSpriteSheet: new ImageSource(
		FemaleCharacterSpriteSheet,
		false,
		ImageFiltering.Pixel
	),
} as const;

export const loader = new Loader();

for (let res of Object.values(Resources)) {
	loader.addResource(res);
}
