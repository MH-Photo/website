/**
 * tools/photos.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sizeOf from 'image-size';

// in production, the script is run from the dist folder
const projectRoot = '../../';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAlbums = (input) => {
	const albumsPath = path.join(__dirname, projectRoot, input);

	return fs
		.readdirSync(albumsPath, { withFileTypes: true })
		.filter((item) => {
			return item.isDirectory();
		})
		.map((item) => {
			return item.name;
		});
};

const getImages = (input) => {
	const albumPath = path.join(__dirname, projectRoot, input);

	return fs
		.readdirSync(albumPath, {
			withFileTypes: true,
		})
		.filter((item) => {
			return item.isFile();
		})
		.map((item) => {
			return item.name;
		});
};

const getImageData = (album, image) => {
	const img = {};

	const destImage = image.replace(/ /g, '-').replace(/&/g, 'and').toLowerCase();
	img.name = destImage.substring(0, destImage.lastIndexOf('.'));
	img.extension = destImage.substring(destImage.lastIndexOf('.'));
	img.path = `/${album}/`;
	img.url = `/${album}/${destImage}`;

	// image-size doesn't support avif yet: https://github.com/image-size/image-size/issues/125
	// Use jpg instead of avif for for the dimensions
	const dimensions = sizeOf(path.join(__dirname, projectRoot, `/${album}/${image.replace(/\.avif/, '.jpg')}`));
	img.width = dimensions.width;
	img.height = dimensions.height;
	img.orientation = dimensions.width > dimensions.height ? 'landscape' : 'portrait';

	return img;
};

/**
 * getPhotos
 * @param {string} input The path of the photo albums
 * @returns {JSON} the JSON representations of the photo albums
 */
export const photos = (input) => {
	const i = input || 'assets/img/albums';

	const photos = {};

	// Get a list of albums
	const albums = getAlbums(i);

	// Get a list of file in each album
	// biome-ignore lint/complexity/noForEach: TODO: refactor this
	albums.forEach((album) => {
		photos[album] = {};
		photos[album].path = `${i}/${album}`;
		photos[album].images = [];

		const images = getImages(photos[album].path);

		// biome-ignore lint/complexity/noForEach: TODO: refactor this
		images.forEach((image) => {
			photos[album].images.push(getImageData(photos[album].path, image));
		});
	});

	return photos;
};
