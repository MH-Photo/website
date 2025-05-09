/**
 * scripts/album.js
 */

let dialog;

const setPicture = (url) => {
	const picture = dialog?.getElementsByTagName('picture')[0];

	const avif = document.createElement('source');
	avif.srcset = url.replace('.jpg', '.avif');
	avif.type = 'image/avif';

	const webp = document.createElement('source');
	webp.srcset = url.replace('.jpg', '.webp');
	webp.type = 'image/webp';

	const jpg = document.createElement('source');
	jpg.srcset = url;
	jpg.type = 'image/webp';

	const img = document.createElement('img');
	img.src = url;

	picture.appendChild(avif);
	picture.appendChild(webp);
	picture.appendChild(jpg);
	picture.appendChild(img);
};

const resetPicture = () => {
	const picture = dialog?.getElementsByTagName('picture')[0];

	while (picture.lastChild) {
		picture.removeChild(picture.lastChild);
	}
};

const setNavigation = (currentUrl) => {
	const previousBtn = document.getElementById('previous-photo');
	const nextBtn = document.getElementById('next-photo');
	const path = new URL(currentUrl).pathname;

	const element = document.querySelector(`[href="${path}"`);

	previousBtn.href = element?.previousElementSibling?.href || '';
	nextBtn.href = element?.nextElementSibling?.href || '';
};

const closeDialog = () => {
	resetPicture();
	dialog.close();
};

const gotToPhoto = (event) => {
	resetPicture();
	setPicture(event.currentTarget.href);
	setNavigation(event.currentTarget.href);
	event.preventDefault();
};

const openDialog = (event) => {
	setPicture(event.currentTarget.href);
	setNavigation(event.currentTarget.href);

	dialog?.showModal();
	event.preventDefault();
};

const init = () => {
	dialog = document.getElementById('photo-dialog');
	const album = document.getElementsByTagName('main')[0];

	if (!(dialog && album)) {
		return;
	}

	const closeBtn = document.getElementById('close-dialog');
	closeBtn?.addEventListener('click', closeDialog);

	const previousBtn = document.getElementById('previous-photo');
	const nextBtn = document.getElementById('next-photo');
	previousBtn?.addEventListener('click', gotToPhoto);
	nextBtn?.addEventListener('click', gotToPhoto);

	// Close the dialog when clicking on the backdrop
	dialog.addEventListener('click', (event) => {
		let rect = dialog.getBoundingClientRect();
		const isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;

		rect = previousBtn.getBoundingClientRect();
		const isInPreviousBtn =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;

		rect = nextBtn.getBoundingClientRect();
		const isInNextBtn =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;

		if (!(isInDialog || isInPreviousBtn || isInNextBtn)) {
			closeDialog();
		}
	});

	dialog.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft' && previousBtn.href !== previousBtn.baseURI) {
			previousBtn.click();
		} else if (event.key === 'ArrowRight' && nextBtn.href !== nextBtn.baseURI) {
			nextBtn.click();
		}
	});

	const photos = album.getElementsByTagName('a');
	// biome-ignore lint/complexity/noForEach: TODO: refactor this
	Array.from(photos).forEach((element) => {
		if (!element.id) {
			element.addEventListener('click', openDialog);
		}
	});
};

init();
