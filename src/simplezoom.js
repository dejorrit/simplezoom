let options = {
	'padding': 50,
	'openDelay': 350,
	'closeDelay': 0,
	'transitionDuration': 350,
	'closeOnScroll': true,
	'closeOnEscape': true
};

// states are used to prevent closing/opening while transition is active
const STATE_CLOSED = 'closed',
	STATE_CLOSING = 'closing',
	STATE_OPENED = 'opened',
	STATE_OPENING = 'opening';

export default class Simplezoom {

	constructor(element, userOptions = {}) {
		Object.assign(options, userOptions);

		this.el = element;
		this.state = STATE_CLOSED;
		this.originalStyles = {};

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.toggle = this.toggle.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);

		this.el.addEventListener('click', this.toggle);
	}

	open() {
		if (this.state !== STATE_CLOSED) {
			return false;
		}

		this.state = STATE_OPENING;
		onOpen();

		setTimeout(() => {
			this.showOverlayElement();
			this.saveOriginalStyles();
			this.animateToFullScreen();
			this.addEventListeners();

			this.state = STATE_OPENED;
			onOpenComplete();
		}, options.openDelay);
	}

	close() {
		if (this.state !== STATE_OPENED) {
			return false;
		}

		this.state = STATE_CLOSING;
		onClose();

		setTimeout(() => {
			this.hideOverlayElement();
			this.animateToOriginalPosition();

			this.state = STATE_CLOSED;
			onCloseComplete();
		}, options.closeDelay);

		setTimeout(() => {
			this.cleanup();
		}, options.closeDelay + options.transitionDuration);
	}

	toggle() {
		if (this.state === STATE_CLOSED) {
			this.open();
		} else if (this.state === STATE_OPENED) {
			this.close();
		}
	}

	onKeyUp(event) {
		if (event.key === 'Escape' || event.code === 'Escape' || event.keyCode === 27) {
			this.close();
		}
	}

	addEventListeners() {
		if (options.closeOnScroll) {
			window.addEventListener('scroll', this.close);
		}

		if (options.closeOnEscape) {
			document.addEventListener('keyup', this.onKeyUp);
		}

		if (this.overlay) {
			this.overlay.addEventListener('click', this.close);
		}
	}

	removeEventListeners() {
		if (options.closeOnScroll) {
			window.removeEventListener('scroll', this.close);
		}

		if (options.closeOnEscape) {
			document.removeEventListener('keyup', this.onKeyUp);
		}

		if (this.overlay) {
			this.overlay.removeEventListener('click', this.close);
		}
	}

	cleanup() {
		this.removeEventListeners();

		if (this.overlay && this.overlay.parentNode) {
			this.overlay.parentNode.removeChild(this.overlay);
		}
	}

	saveOriginalStyles() {
		let styles = window.getComputedStyle(this.el, null);

		this.originalStyles = {
			'position': styles.getPropertyValue('position'),
			'transform': styles.getPropertyValue('transform')
		}
	}

	animateToFullScreen() {
		let position = window.getComputedStyle(this.el, null).getPropertyValue('position'),
			translate = this.calculateTranslateValues(),
			zoom = this.calculateZoomValue();

		if (position === 'static') {
			position = 'relative';
		}

		Object.assign(this.el.style, getAdditionalTargetStyles(), {
			'position': position,
			'transform': `translate(${translate.X}px, ${translate.Y}px) scale(${zoom})`
		});
	}

	animateToOriginalPosition() {
		this.el.style.transform = this.originalStyles.transform;

		setTimeout(() => {
			this.el.removeAttribute('style');
		}, options.closeDelay + options.transitionDuration);
	}

	calculateTranslateValues() {
		let rect = this.el.getBoundingClientRect(),
			elementX = rect.left + (rect.width / 2),
			elementY = rect.top + (rect.height / 2),

			viewportX = window.innerWidth / 2,
			viewportY = window.innerHeight / 2;

		return {
			'X': viewportX - elementX,
			'Y': viewportY - elementY,
		};
	}

	calculateZoomValue() {
		let rect = this.el.getBoundingClientRect(),
			elementH = rect.height,
			elementW = rect.width,

			viewportW = window.innerWidth - options.padding,
			viewportH = window.innerHeight - options.padding,

			shouldStretchToHeight = (elementH / elementW) > (viewportH / viewportW);

		return shouldStretchToHeight ? (viewportH / elementH) : (viewportW / elementW);
	}

	showOverlayElement() {
		this.overlay = createOverlayElement();

		let repaint = this.overlay.offsetWidth; // trigger repaint before animating
		this.overlay.style.opacity = 0.8;
	}

	hideOverlayElement() {
		this.overlay.style.opacity = 0;

		setTimeout(() => {
			if (this.overlay && this.overlay.parentNode) {
				this.overlay.parentNode.removeChild(this.overlay);
			}
		}, options.closeDelay + options.transitionDuration);
	}
}

function getAdditionalTargetStyles() {
	return {
		'willChange': 'transform',
		'transition': `transform ${options.transitionDuration}ms ease`,
		'zIndex': 10000
	}
}

function getOverlayStyles() {
	return {
		'position': 'fixed',
		'top': 0,
		'right': 0,
		'bottom': 0,
		'left': 0,
		'cursor': 'zoom-out',
		'opacity': 0,
		'backgroundColor': '#000',
		'transition': `opacity ${options.transitionDuration}ms ease`,
		'zIndex': 9999
	}
}

function createOverlayElement() {
	let overlay = document.createElement('div');
	Object.assign(overlay.style, getOverlayStyles());

	return document.body.appendChild(overlay);
}

/*
 * Callback methods
 * */

function onOpen() {
	if (options.onOpen && typeof options.onOpen === 'function') {
		options.onOpen();
	}
}

function onOpenComplete() {
	if (options.onOpenComplete && typeof options.onOpenComplete === 'function') {
		options.onOpenComplete();
	}
}

function onClose() {
	if (options.onClose && typeof options.onClose === 'function') {
		options.onClose();
	}
}

function onCloseComplete() {
	if (options.onCloseComplete && typeof options.onCloseComplete === 'function') {
		options.onCloseComplete();
	}
}
