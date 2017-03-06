/*
 * Template definition used in creating html elements with predefined functionality
 * @returns {undefined}
 * */
const Template = function () {
};
Template.add = function () {
	if (typeof arguments[0] === 'undefined') {
		return false;
	}
	let $input = {};
	let $i = 0;
	while (typeof $input === 'object' && this instanceof HTMLElement) {
		$input = arguments[$i];
		arguments[0].appendChild(this);
		$i++;
	}
};
Template.draggable = function (element, configuration) {
	element.dragging = null;
	if (configuration) {
		element.configuration = configuration;
	} else {
		element.configuration = {};
	}
	JF.events.addListener(element, "mousedown", function (e) {
		if (typeof element.configuration) {
			if (element.configuration.container !== 'undefined') {
				element.configuration.container.style.float = 'left';
				let container = element.configuration.container.getBoundingClientRect();
				element.container = {
					left: parseInt(container.left),
					top: parseInt(container.top),
					right: parseInt(container.right),
					bottom: parseInt(container.bottom),
					width: parseInt(container.width),
					height: parseInt(container.height)
				};
			} else {
				let container = window.getBoundingClientRect();
				element.container = {
					left: parseInt(container.left),
					top: parseInt(container.top),
					right: parseInt(container.right),
					bottom: parseInt(container.bottom),
					width: parseInt(container.width),
					height: parseInt(container.height)
				};
			}
		}
		if (!e) {
			let e = window.event || e
		}
		element.style.position = 'relative';
		element.style.float = 'left';
		let elementDimensions = element.getBoundingClientRect();
		element.dragging = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			startX: parseInt(elementDimensions.left),
			startY: parseInt(elementDimensions.top),
			width: parseInt(elementDimensions.width),
			height: parseInt(element.getBoundingClientRect().height)
		};
		if (element.setCapture)
			element.setCapture();
	}, true);

	JF.events.addListener(element, "losecapture", function () {
		element.dragging = null;
	});
	JF.events.addListener(window, "mouseup", function (e) {
		element.dragging = null;
		element.removeEventListener('onmouseup');
		dragTarget.removeEventListener('onmousmove');
	}, true);

	let dragTarget = element.setCapture ? element : window;

	JF.events.addListener(dragTarget, "mousemove", function (e) {
		if (!element.dragging)
			return;

		if (!e) {
			let e = window.event || e
		}
		let top = e.clientY - element.container.top - (element.getBoundingClientRect().height / 2);
		let left = e.clientX - element.container.left - (element.getBoundingClientRect().width / 2);
		let right = left + element.dragging.width;
		let bottom = top + element.dragging.height;

		if (right >= element.container.width || left <= 0) {
		} else {
			element.style.left = (left / element.container.width * 100) + "%";
		}
		if (bottom >= element.container.height || top <= 0) {
		} else {
			element.style.top = (top / element.container.height * 100) + "%";
		}
	}, true);
};
Template.addDragging = function () {
	if (!arguments[0] instanceof HTMLElement) {
		console.log('wrong input');
		return false;
	}
	let element = arguments[0];
	if (typeof arguments[1] !== 'undefined') {
		let props = arguments[1];
	}
	element.onmousedown = function (event) {
		let src = event.srcElement;
		let clone = src.cloneNode(true);
		if (clone instanceof HTMLElement) {
			JF.templates.page.html.insertBefore(clone, JF.templates.page.html.firstChild);
		} else {
			return;
		}
		let properties = {
			container: JF.templates.page.html
		};
		Template.draggable(clone, properties);
	};
};
Template.createEvents = function () {
	try {
		Object.defineProperty(arguments[0], 'text', {
			enumerable: true,
			configurable: true,
			set: function () {
				if (typeof arguments[0] === 'string') {
					this.childNodes[0].textContent = arguments[0];
				} else if (typeof arguments[0] === 'object') {
					let content = JF(arguments[0]);
					if (content instanceof HTMLElement) {
						this.appendChild(content);
					}
				}

			},
			get: function () {
				if (this.childNodes[0]) {
					return this.childNodes[0].textContent;
				}
			}
		});
		Object.defineProperty(arguments[0], 'class', {
			enumerable: true,
			configurable: true,
			set: function () {
				this.className = arguments[0];
			},
			get: function () {
				return this.className;
			}
		});
	} catch (error) {
		arguments[0]['text'] = (function () {
			let self = this;
			if (typeof arguments[0] === 'string') {
				self.childNodes[0].textContent = arguments[0];
			} else if (typeof arguments[0] === 'object') {
				let content = JF(arguments[0]);
				if (content instanceof HTMLElement) {
					self.appendChild(content);
				}
			} else {
				if (self.childNodes) {
					return self.childNodes[0].textContent;
				}
			}
		})();
		arguments[0]['class'] = (function () {
			let self = this;
			if (typeof arguments[0] === 'string') {
				self.childNodes[0].textContent = arguments[0];
			} else if (typeof arguments[0] === 'object') {
				let content = JF(arguments[0]);
				if (content instanceof HTMLElement) {
					self.appendChild(content);
				}
			} else {
				return self.className;
			}
		})();
	}
};
export default Template;