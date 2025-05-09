module.exports = {
	plugins: [
		require('postcss-nesting'),
		require('autoprefixer'),
		require('@csstools/postcss-oklab-function'),
		require('postcss-preset-env')({
			preserve: true,
		}),
		require('cssnano')({
			preset: 'default',
		}),
	],
};
