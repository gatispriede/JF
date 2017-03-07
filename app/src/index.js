/**
 * Copyright (C) 2014 Funisimo
 */
import JF from "./JF";
JF.debug = function () {
	if (typeof arguments[0] !== 'undefined') {
		if (typeof JF.debug.items === 'undefined') {
			JF.debug.items = {};
		}
		JF.debug.items[Date()] = {
			message: arguments[0],
			content: arguments[1]
		};
		return true;
	}
	return (JF.debug.items);
};
/*
 * Initializing functionality for JF objects and defaults
 * @type type
 */
const JFcore = {
	init: function () {
		JFcore.createJF();
		JF.status = 'Init';
		JFcore.createGlobalFunctions();
		JFcore.createGlobalFunctions.description = 'Creates Global functions';
		JF.watch('status', JF.setStatus);
		JF.status = "Done loading Framework";
		JFcore.init = null;
	},
	createJF: function () {
		JF.events = {};
		JF.stringify = function () {
			let $iteration = 0;
			if (typeof arguments[1] !== 'undefined') {
				$iteration = arguments[1] + 1;
			}
			let $result = '{';
			for (let id in arguments[0]) {
				switch (typeof arguments[0][id]) {
					case('string'):
						$result += '"' + id + '"' + ':' + '"' + arguments[0][id] + '",';
						break;
					case('object'):
						$result += '"' + id + '"' + ':' + '' + JF.stringify(arguments[0][id], $iteration) + ',';
						break;
					case('function'):
						if (arguments[0].hasOwnProperty(id)) {
							arguments[0][id] = arguments[0][id].toLocaleString().replace('"', "\"").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "");
							$result += '"' + id + '"' + ':' + '"' + arguments[0][id] + '",';
							break;
						}
				}
			}
			$result += '}';
			$result = $result.replace(',}', '}');
			return $result;
		};
		JF.private = function () {
			if (typeof arguments[0] === 'undefined' || typeof arguments[1] === 'undefined' || typeof arguments[2] === 'undefined') {
				return false;
			}
			Object.defineProperty(arguments[0], arguments[1], {
				writable: false,
				enumerable: false,
				configurable: false,
				value: arguments[2]
			});
		};
		JF.public = function () {
			if (typeof arguments[0] === 'undefined' || typeof arguments[1] === 'undefined' || typeof arguments[2] === 'undefined') {
				return false;
			}
			Object.defineProperty(arguments[0], arguments[1], {
				writable: true,
				enumerable: true,
				configurable: true,
				value: arguments[2]
			});
		};
		JF.setStatus = function () {
			let status = arguments[2];
		};
		return true;
	},
	createGlobalFunctions: function () {
		const Global = () => {
			const object = arguments[0];
			if (typeof object === 'undefined') {
				return false;
			} else if (typeof object === 'object' && typeof object.value !== 'undefined' && typeof object.name !== 'undefined') {
				JF.public(this, object.name, object.value);
				if (typeof JF.global === 'undefined') {
					JF.public(JF, 'global', []);
				}
				JF.global.push(object.name);
				if (typeof object.description !== 'undefined') {
					object.name.description = object.description;
				}
			}
		};

		let global = {
			name: 'log',
			value: function () {
				console.log(arguments);
			}
		};
		Global(global);
		global = {
			name: 'clearTimeouts',
			value: function () {
				for (let i = 1; i < 1000; i++) {
					clearTimeout(i);
				}
			},
			description: 'Clears all timeouts'
		};
		Global(global);
		global = {
			name: 'type',
			value: function () {
				if (typeof arguments[1] === 'undefined') {
					return ({}).toString.call(arguments[0]).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
				} else if (type(arguments[0]) === String('' + arguments[1])) {
					return true;
				}
				return false;
			},
			description: 'Checks the input type'
		};
		Global(global);
		global = {
			name: 'isElement',
			value: function () {
				if (!arguments[0] instanceof HTMLElement) {
					return false;
				}
				if (arguments[1]) {
					switch (arguments[0].nodeType) {
						case(1): {
							return ("ELEMENT_NODE");
						}
						case(2): {
							return ("ATTRIBUTE_NODE");
						}
						case(3): {
							return ("TEXT_NODE");
						}
						case(4): {
							return ("CDATA_SECTION_NODE");
						}
						case(5): {
							return ("ENTITY_REFERENCE_NODE");
						}
						case(6): {
							return ("ENTITY_NODE");
						}
						case(7): {
							return ("PROCESSING_INSTRUCTION_NODE");
						}
						case(8): {
							return ("COMMENT_NODE");
						}
						case(9): {
							return ("DOCUMENT_NODE");
						}
						case(10): {
							return ("DOCUMENT_TYPE_NODE");
						}
						case(11): {
							return ("DOCUMENT_FRAGMENT_NODE");
						}
						case(12): {
							return ("NOTATION_NODE");
						}
						default : {
							return false;
						}
					}
				}
				if (arguments[0].nodeType >= 0) {
					return true;
				} else {
					return false;
				}
			},
			description: 'checks if input is DOM element, returns true or false, OR if second parameter is true, it returns the type of DOM element'
		};
		Global(global);
		global = {
			name: 'inside',
			value: function () {//checks if element is inside window
				if (typeof arguments[0] === 'undefined') {
					return false;
				}
				if (document.all[0].clientHeight - arguments[0] < 0) {
					return false;
				}
				return true;
			},
			description: "Checks if element is within window object by it's height"
		};
		Global(global);
	}
};
/*
 * polymorphs for browsers without watch functionality built in
 * creates 2 prototypes for object = watch and unwatch
 */
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch",
		{
			enumerable: false,
			configurable: true,
			writable: true,
			value: function (prop, handler) {
				let oldval = this[prop],
					newval = oldval,
					getter = function () {
						return newval;
					},
					setter = function (val) {
						oldval = newval;
						return newval = handler.call(this, prop, oldval, val);
					};
				if (this[prop] = undefined) { // can't watch constants
					Object.defineProperty(this, prop, {
						get: getter, set: setter, enumerable: true, configurable: true
					});
				}
			}
		});
	Object.watch.description = 'Creates a watcher for Object property when value is changed: property,function';
}
if (!Object.prototype.unwatch) {// object.unwatch
	Object.defineProperty(Object.prototype, "unwatch", {
		enumerable: false, configurable: true, writable: true, value: function (prop) {
			let val = this[prop];
			this[prop] = undefined; // remove accessors
			this[prop] = val;
		}
	});
	Object.unwatch.description = 'Deletes watcher for property';
}
JFcore.init();

/*
 * Symple polyfill for events which goes out of the actual browser window,
 *  to not lose the interaction with page.

 * @param {type} element
 * @param {type} type
 * @param {type} callback
 * @param {type} capture
 * @returns {undefined} */
JF.events.addListener = function (element, type, callback, capture) {
	if (element.addEventListener) {
		element.addEventListener(type, callback, capture);
	} else {
		element.attachEvent("on" + type, callback);
	}
};
/*
 * JF event halndling
 * target = to create simple interface of accessing, triggering, creating, and handling Events on page
 * Each JF.* event has covered live information about events
 * examples = last touch element, current mouse position on x and y,
 * keyboard activities, mouse action like moving not moving, idle, clicks etc...
 *
 */
JF.createEvents = function () {
	JF.mouse = {
		status: false
	};
	JF.keyboard = {
		status: false
	};
	JF.touch = {
		status: false
	};
	setMouseCoordinates = function (event) {
		JF.mouse.status = 'moving';
//        JF.mouse.x = event.x;
//        JF.mouse.y = event.y;
		JF.mouse.event = event;
	};
	setTouchCoordinates = function (event) {
		JF.touch.status = 'moving';
		JF.touch.x = event.x;
		JF.touch.y = event.y;
		JF.touch.event = event;
	};
	setMouseIdle = function () {
		JF.mouse.status = 'idle';
	};
	window.touchstart = function (event) {
		JF.touch.status = 'down';
	};
	window.touchend = function (event) {
		JF.touch.status = 'up';
	};
	window.touchenter = function (event) {
		JF.touch.status = 'enter';
	};
	window.touchleave = function (event) {
		JF.touch.status = 'leave';
	};
	window.touchmove = function (event) {
		this.setTouchCoordinates(event);
		setTimeout(setMouseIdle, 100);
	};
	window.onmousemove = function (event) {
		this.setMouseCoordinates(event);
		setTimeout(setMouseIdle, 100);
	};
	window.onmouseenter = function () {
		JF.mouse.state = 'enter';
		setTimeout(setMouseIdle, 100);
	};
	window.onmousedown = function () {
		JF.mouse.status = 'down';
		setTimeout(setMouseIdle, 100);
	};
	window.onmouseup = function () {
		JF.mouse.status = 'up';
		setTimeout(setMouseIdle, 100);
	};
	window.onmouseleave = function () {
		JF.mouse.state = 'leave';
		setTimeout(setMouseIdle, 100);
	};
};

(JF.initEvents = function () {
	if (document.readyState === 'interactive') {
		let time = setTimeout(JF.initEvents, 100);
	} else {
		if (document.readyState === 'complete') {
			JF.createEvents();
		}
	}
}());
export {JF as default};