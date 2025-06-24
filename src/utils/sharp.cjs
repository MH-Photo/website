/**
 * tools/sharp.js
 */

const path = require('node:path');
const fs = require('node:fs');
const sharp = require('sharp');

const sizes = [100, 400, 1920];
const formats = ['jpg', 'webp', 'avif'];
const srcPath = path.join(__dirname, '../../assets/img');
const destPath = 'public/assets/img/';

/**
 * Get all files matching the pattern from a path
 * @param {*} dir the directory to look into
 * @returns {Array} The list of files
 */
function* getFiles(dir) {
	const dirents = fs.readdirSync(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = path.resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* getFiles(res);
		} else {
			yield res.replace(srcPath + path.sep, '');
		}
	}
}

(async () => {
	for await (const f of getFiles(srcPath)) {
		const input = path.join(srcPath, f);
		const file = f
			.replace(srcPath + path.sep, '')
			.replace(/\\/g, '/')
			.replace(/ /g, '-')
			.replace(/&/g, 'and')
			.toLowerCase();
		const output = destPath + file.substring(0, file.lastIndexOf('.'));
		const dir = output.substring(0, output.lastIndexOf('/'));

		// Create destination folder
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		sizes.forEach((size) => {
			formats.forEach((format) => {
				const out = `${output}-${size}.${format}`;
				sharp(input)
					.withMetadata({
						exif: {
							IFD0: {
								XPAuthor: 'Manuel Hamel',
								Copyright: 'Manuel Hamel Photography',
							},
						},
					})
					.resize({ width: size })
					.toFormat(format)
					.toFile(out)
					.then(console.log(`${input} => ${out}`));
			});
		});
	}
})();
