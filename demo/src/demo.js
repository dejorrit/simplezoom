import Simplezoom from 'simplezoom';

let images = document.querySelectorAll('.js-image');

Array.from(images).forEach((image) => {
	new Simplezoom(image);
});
