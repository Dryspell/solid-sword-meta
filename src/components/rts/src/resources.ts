import { ImageFiltering, ImageSource, Loader } from "excalibur";

import FemaleCharacterSpriteSheet from "../res/female_char/SpriteSheet.png";
import Iron_Big from "../res/iron/Blue_crystal1.png";
import Iron_Med from "../res/iron/Blue_crystal2.png";
import Iron_Small from "../res/iron/Blue_crystal3.png";

export const Resources = {
	FemaleCharacterSpriteSheet: new ImageSource(
		FemaleCharacterSpriteSheet,
		false,
		ImageFiltering.Pixel
	),
	Iron_Big: new ImageSource(Iron_Big, false, ImageFiltering.Pixel),
	Iron_Med: new ImageSource(Iron_Med, false, ImageFiltering.Pixel),
	Iron_Small: new ImageSource(Iron_Small, false, ImageFiltering.Pixel),
} as const;

export const createLoader = () => {
	const loader = new Loader();

	for (let res of Object.values(Resources)) {
		loader.addResource(res);
	}

	return loader;
};
