const OPTIONS = {
	'padding': 50,
	'openDelay': 0,
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

module.exports = class {

	constructor(element, userOptions = {}) {
		this.options = Object.assign({}, OPTIONS, userOptions);

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
		this.onOpen();
	}

	close() {
		if (this.state !== STATE_OPENED) {
			return false;
		}

		this.state = STATE_CLOSING;
		this.onClose();
	}

	toggle() {
		if (this.state === STATE_CLOSED) {
			this.open();
		} else if (this.state === STATE_OPENED) {
			this.close();
		}
	}

	onOpen() {
		setTimeout(() => {
			this.showOverlayElement();
			this.saveOriginalStyles();
			this.animateToFullScreen();
			this.addEventListeners();
		}, this.options.openDelay);

		setTimeout(() => {
			this.state = STATE_OPENED;
			this.onOpenComplete();
		}, this.options.openDelay + this.options.transitionDuration);

		// callback
		if (this.options.onOpen && typeof this.options.onOpen === 'function') {
			this.options.onOpen();
		}
	}

	onOpenComplete() {
		// callback
		if (this.options.onOpenComplete && typeof this.options.onOpenComplete === 'function') {
			this.options.onOpenComplete();
		}
	}

	onClose() {
		setTimeout(() => {
			this.hideOverlayElement();
			this.animateToOriginalPosition();
		}, this.options.closeDelay);

		setTimeout(() => {
			this.state = STATE_CLOSED;
			this.onCloseComplete();
		}, this.options.closeDelay +  + this.options.transitionDuration);

		// callback
		if (this.options.onClose && typeof this.options.onClose === 'function') {
			this.options.onClose();
		}
	}

	onCloseComplete() {
		this.cleanup();

		// callback
		if (this.options.onCloseComplete && typeof this.options.onCloseComplete === 'function') {
			this.options.onCloseComplete();
		}
	}

	onKeyUp(event) {
		if (event.key === 'Escape' || event.code === 'Escape' || event.keyCode === 27) {
			this.close();
		}
	}

	addEventListeners() {
		if (this.options.closeOnScroll) {
			window.addEventListener('scroll', this.close);
		}

		if (this.options.closeOnEscape) {
			document.addEventListener('keyup', this.onKeyUp);
		}

		if (this.overlay) {
			this.overlay.addEventListener('click', this.close);
		}
	}

	removeEventListeners() {
		if (this.options.closeOnScroll) {
			window.removeEventListener('scroll', this.close);
		}

		if (this.options.closeOnEscape) {
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

		Object.assign(this.el.style, this.getAdditionalTargetStyles(), {
			'position': position,
			'transform': `translate(${translate.X}px, ${translate.Y}px) scale(${zoom})`
		});
	}

	animateToOriginalPosition() {
		this.el.style.transform = this.originalStyles.transform;

		setTimeout(() => {
			this.el.removeAttribute('style');
		}, this.options.closeDelay + this.options.transitionDuration);
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

			viewportW = window.innerWidth - this.options.padding,
			viewportH = window.innerHeight - this.options.padding,

			shouldStretchToHeight = (elementH / elementW) > (viewportH / viewportW);

		return shouldStretchToHeight ? (viewportH / elementH) : (viewportW / elementW);
	}

	createOverlayElement() {
		let overlay = document.createElement('div');
		Object.assign(overlay.style, this.getOverlayStyles());

		return document.body.appendChild(overlay);
	}

	showOverlayElement() {
		this.overlay = this.createOverlayElement();

		let repaint = this.overlay.offsetWidth; // trigger repaint before animating
		this.overlay.style.opacity = 0.8;
	}

	hideOverlayElement() {
		this.overlay.style.opacity = 0;

		setTimeout(() => {
			if (this.overlay && this.overlay.parentNode) {
				this.overlay.parentNode.removeChild(this.overlay);
			}
		}, this.options.closeDelay + this.options.transitionDuration);
	}

	getAdditionalTargetStyles() {
		return {
			'willChange': 'transform',
			'transition': `transform ${this.options.transitionDuration}ms ease`,
			'zIndex': 10000
		}
	}

	getOverlayStyles() {
		return {
			'position': 'fixed',
			'top': 0,
			'right': 0,
			'bottom': 0,
			'left': 0,
			'cursor': 'zoom-out',
			'opacity': 0,
			'backgroundColor': '#000',
			'transition': `opacity ${this.options.transitionDuration}ms ease`,
			'zIndex': 9999
		}
	}

};
