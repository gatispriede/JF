/*
 * Creates "Creator" global object used to parse json into html
 * Holds key functionality
 *
 * @returns {Array|JF.$returnObject|Boolean} */
import Template from "./Template";
/*
 * Global style definition for easier style accessability within templates and also document
 */
const addStyle = function ($newRule) {
	let place = JF.style.rules !== undefined ? JF.style.rules.length : 0;
	JF.style.insertRule($newRule, place);
	let obj = {
		place: place,
		rule: JF.style.rules[place]
	};
	obj.remove = function () {
		JF.style.removeRule(this.place);
	};
	if (typeof arguments[1] === 'string') {
		JF.templates[arguments[1]].cssRules.push(obj);
	}
	return obj;
};

const JF = function () {
	if (typeof arguments[0] === 'undefined') {
		return false;
	}
	let $parent = {};
	let $i = 0;
	let $append = false;
	let $element;
	//for simple htmll elements
	if (arguments[0] instanceof HTMLElement) {
		$parent = arguments[0];
		$append = true;
		$i = 1;
	}
	//for jQuery elements
	else if (arguments[0][0] instanceof HTMLElement) {
		$parent = arguments[0][0];
		$append = true;
		$i = 1;
	}
	let $input = arguments[$i];
	let $returnObject = [];
	//loop through all objects within input
	while ($input instanceof Object) {
		//create with specific key - used in case of overrides
		if (arguments[$i].save === true && JF.templates[arguments[$i].id] !== undefined) {
			$element = JF.templates[arguments[$i].id].html;
			$returnObject.push(arguments[$i].id);
		}
		//else create with random number as key
		else {
			$element = JF.element(JF.clone(arguments[$i]));
			$returnObject.push($element.id);
		}
		if ($append && $element instanceof HTMLElement) {
			$parent.appendChild($element);
			if (JF.templates[$element.id].funcArr !== undefined) {
				for (let $id in JF.templates[$element.id].funcArr) {
					let func = JF.templates[$element.id].funcArr[$id].func;
					let element = JF.templates[$element.id].funcArr[$id].element;
					if (typeof func === 'function') {
						func(element);
					}
				}
			}
			if (typeof $element.onload === 'function') {
				$element.onload();
			}
		}
		$i++;
		$input = arguments[$i];
	}
	return $returnObject;
};
JF.style = {
	addStyle: addStyle
};
JF.templates = Template;
/*
 * Main function for copying the attributes of incomming elements
 * used in creation, filling template and indexing html

 * @returns {Array|JF.clone.copy|Arguments} */
JF.clone = function () {
	// Handle the 3 simple types, and null or undefined
	if (null === arguments[0] || "object" !== typeof arguments[0])
		return arguments[0];

	// Handle Date
	if (arguments[0] instanceof Date) {
		let copy = new Date();
		copy.setTime(arguments[0].getTime());
		return copy;
	}

	// Handle Array
	if (arguments[0] instanceof Array) {
		let copy = [];
		for (let i = 0, len = arguments[0].length; i < len; i++) {
			copy[i] = JF.clone(arguments[0][i]);
		}
		return copy;
	}

	// Handle Object
	if (arguments[0] instanceof Object) {
		let copy = {};
		for (let attr in arguments[0]) {
			if (arguments[0].hasOwnProperty(attr)) {
				copy[attr] = arguments[0][attr];
			}
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
};
/*
 * Main html element creation method
 * recursively creates all elements from input object

 * @returns {JF.element.element|Element|JF.element.$object|Arguments|JF.templates.htmlelement|Boolean|undefined} */
JF.element = function () {
	if (typeof arguments[0] !== 'object') {
		return;
	}
	let $object = arguments[0];
	let element, ruleName, $rule, $key, $iteration;
	/*
	 Define element, or parent element
	 */
	if (arguments[2] === undefined) {
		this.class = undefined;
		if ($object.override === true && $object.id !== undefined && JF.templates[$object.id] !== undefined) {
			JF.templates[$object.id].remove();
		}
		if ($object.id === undefined) {
			$object.id = 'JF' + (Math.floor(Math.random() * 1000)) + Date.now() + 'JF';
		}
		else if (JF.templates[$object.id] !== undefined && $object.override === undefined) {
			$object.id = 'JF' + (Math.floor(Math.random() * 1000)) + Date.now() + 'JF';
		}
		$object.id = $object.id.replace(/ /g, '');
		this.id = $object.id;
		this.cssRule = "";
		this.elementHerachy = "";
		JF.templates[this.id] = {
			elements: {},
			name: this.id,
			html: {},
			funcArr: [],
			cssRules: [],
			template: JF.clone(arguments[0])
		};
		JF.templates[this.id].remove = function () {
			JF.templates[this.name].html !== undefined ? this.html.remove() : '';
			JF.templates[this.name].cssRules = JF.templates[this.name].cssRules.reverse();
			if (JF.templates[this.name].cssRules[0] !== undefined) {
				for (let id in JF.templates[this.name].cssRules) {
					JF.templates[this.name].cssRules[id].remove();
				}
			}
			JF.templates[this.name] = undefined;
		};
		let doc = document.createDocumentFragment();
		element = document.createElement($object.element);
		if (element instanceof HTMLElement) {
			doc.appendChild(element);
		}
		$iteration = 0;
		this.elementHerachy = " ";
	} else {
		element = document.createElement($object.element);
		$iteration = arguments[2] + 1;
	}
	this.type = $object.element;

	if (arguments[2] !== undefined) {
		if (this.parent === arguments[1]) {
			this.elementHerachy = this.elementHerachy.split().reverse();
			this.elementHerachy.shift();
			this.elementHerachy = this.elementHerachy.reverse().join('');
		}
		this.elementHerachy += " " + $object.element;
	}
	this.parent = arguments[1];
	/*
	 Apply properties to element
	 */
	if (typeof $object === 'object') {
		typeof $object.class !== 'undefined' ? this.class = $object.class : '';
		typeof $object.id !== 'undefined' ? element.name = $object.id : '';
		for (let $key in $object) {
			if (typeof $object[$key] === 'undefined' || typeof $object[$key] === null) {
				continue;

			}
			this.class = $object[$key].class !== undefined ? $object[$key].class : '';
			if (typeof $object[$key] === 'string' || typeof $object[$key] === 'number' || typeof $object[$key] === 'function') {
				switch ($key.toLowerCase()) {
					case('text'):
						element['textContent'] = $object[$key];
						break;
					case('name'):
						element.setAttribute('name', $object[$key]);
						break;
					case('inlinestyle'):
						try {
							if ($object[$key].search(';') > -1) {
								let $styles = $object[$key].split(';');
								for (let $style in $styles) {
									let inlineRule = $styles[$style].replace(';', '').split(':');
									element.style[inlineRule[0]] = inlineRule[1];
								}
							} else {
								let inlineRule = $object[$key].replace(';', '').split(':');
								element.style[inlineRule[0]] = inlineRule[1];
							}
						} catch (error) {
							console.error(error);
						}
						break;
					case('style'):
						this.cssRules = "";
						if ($object.class !== undefined) {
							ruleName = " ." + $object.class.replace(' ', '.');
						} else {
							ruleName = this.class !== undefined ? " ." + this.class.replace(' ', '.') + " " : "";// + this.type : "";
						}
						if (arguments[2] === undefined) {
							$rule = '#' + this.id + ruleName + " { ";
						} else {
							$rule = '#' + this.id + " { ";
						}
						$rule += $object[$key] + ';';
						$rule += "}";
						this.cssRules += " ###*###" + $rule + "; ";
						break;
					case('class'):
						element['className'] = $object[$key];
						break;
					case('data'):
						element[$key] = $object[$key];
						break;
					default:
						if (typeof $object[$key] === 'function' && $key.search('custom') > -1) {
							JF.templates[this.id].funcArr.push({element: element, func: $object[$key]});
						} else {
							element[$key] = $object[$key];
						}
						break;
				}
			} else if (typeof $object[$key] === 'object') {
				if ($key.toLowerCase() === 'style') {
					if ($object.class !== undefined) {
						ruleName = " ." + $object.class.replace(' ', '.');
					} else {
						ruleName = this.elementHerachy;
//                        if (this.class !== '' || this.class !== undefined) {
//                            ruleName = " ." + this.class.replace(' ', '.') + " ";// + this.type;
//                        }
					}
					if (arguments[2] === undefined) {
						$rule = '#' + this.id + " { ";
					} else {
						$rule = '#' + this.id + ruleName + " { ";
					}
					$rule = $rule.replace('##', '#');
					for (let rule in $object[$key]) {
						if (typeof $object[$key][rule] !== 'function') {
							$rule += rule + ":" + $object[$key][rule] + ";";
						}
					}
					$rule += "}";
					$rule = $rule.replace(' . ', ' ');
					this.cssRules += "........" + $rule;
				} else if ($key.toLowerCase() === 'inlinestyle') {
					for (let rule in $object[$key]) {
						if (typeof $object[$key][rule] !== 'function') {
							try {
								element.style[rule] = $object[$key][rule].replace(';', '');
							} catch (error) {
								JF.debug(error);
							}
						}
					}
				} else if ($key === 'data') {
					element['data'] = JF.clone($object[$key]);
				} else {
					let elementName = $key;
					let subElement = JF.element($object[$key], $object, $iteration);
					if (subElement instanceof HTMLElement) {
						element.appendChild(subElement);
					}
					JF.templates[this.id].elements[elementName] = subElement;
					/*
					 Apply Template Prototypes
					 */
					JF.templates[this.id].elements[elementName].prototype = Template.prototype;
					Template.createEvents(JF.templates[this.id].elements[elementName]);
				}
			}
		}
		if ($object.hasOwnProperty('dragging')) {
			if ($object['dragging']) {
				Template.addDragging(element);
			}
		}
		if (typeof doc !== 'undefined') {
			JF.templates[this.id].template = $object;
			if (typeof this.id === 'number') {
				if ($object.save !== 'true' || $object.save !== true) {
					JF.templates[this.id] = undefined;
					return element;
				}
			} else {
				if (this.cssRules !== "" && this.cssRules !== undefined) {
					let split = this.cssRules.split("........");
					split[0] = undefined;
					for (let rule in split) {
						let item = split[rule];
						if (typeof item === 'string' && item !== undefined && item !== "" && item !== " ") {
							JF.templates[this.id].cssRules.push(JF.style.addStyle(item));
						}
					}
				}
				this.cssRules = "";
				return JF.templates[this.id].html = element;
			}
		} else {
			return element;
		}
	}
	return false;
};
/*
 * Main JF.templates object creation
 * indexes newly created elements and adds copy to JF.template object

 * @param {type} $input
 * @returns {JF.createTemplate.$return|JF.createTemplate.value|$input.attributes.textContent} */
JF.createTemplate = function ($input) {
	let $key, $attribute, $iteration;
	if (typeof arguments[1] === 'undefined') {
		let $return = {};
		$iteration = 0;
	} else {
		$iteration = arguments[1];
	}
	if ($input instanceof HTMLElement) {
		let $return = {
			element: $input.localName,
			text: typeof $input.childNodes[0] === 'undefined' ? '' : $input.childNodes[0].textContent
		};
		$input.name !== undefined ? $return.name = $input.name : '';
		for ($attribute in $input.attributes) {
			if ($input.attributes.hasOwnProperty($attribute) && $attribute !== 'length') {
				let name = $input.attributes[$attribute].nodeName;
				let value = $input.attributes[$attribute].textContent;
				$return[name] = value;
			}
		}
		for ($key in $input.childNodes) {
			if ($input.childNodes.hasOwnProperty($key) && $key !== 'length') {
				if ($input.childNodes[$key].nodeType === 1) {
					$iteration++;
					$return[$iteration] = JF.createTemplate($input.childNodes[$key], $iteration);
				}
			}
		}
	}
	return $return;
};
/*
 * Used to index all elements within template or in actual html
 * creates links for any elements within parent html element

 * @param {type} $input
 * @param {type} $parent
 * @returns {$input.childNodes} */
JF.indexElements = function ($input, $parent) {
	let $key, $iteration;
	if ($parent === undefined) {
		$parent = {};
	}
	if (arguments[2] === undefined) {
		$iteration = 0;
	} else {
		$iteration = arguments[2];
	}
	if ($input instanceof HTMLElement) {
		for ($key in $input.childNodes) {
			if ($input.childNodes.hasOwnProperty($key) && $key !== 'length') {
				if ($input.childNodes[$key].nodeType === 1) {
					$parent[$iteration] = $input.childNodes[$key];
					$iteration++;
					JF.indexElements($input.childNodes[$key], $parent, $iteration);
				}
			}
		}
	}
	return $parent;
};
/*
 * used to index html elements within box of parent input

 * @returns {undefined|Boolean} */
JF.indexHtml = function () {
	if (arguments[0] === 'undefined') {
		return;
	}
	let $i = 0;
	let $template = {};
	let $input = arguments[$i];
	while ($input instanceof HTMLElement) {
		$template = {
			elements: JF.indexElements($input),
			html: $input,
			name: $input.id || Math.round(Date.now() + Math.random() * 1000),
			template: JF.createTemplate($input)
		};
		JF.templates[$template.name] = $template;
		console.warn("Created Object,'JF.templates." + $template.name + "': ", JF.templates[$template.name]);
		$i++;
		$input = arguments[$i];
	}
	return true;
};
/*
 * Used to fill JF created or writed templates with json type input
 * each key in input json searches for NAME attribute within template to fill it with data from input
 *
 1 argument(@object) = template which needs to be filled
 2 argument(@object/@string/@json)
 */
JF.fillTemplate = function () {
	if (arguments[0] !== object || arguments[1] === undefined) {
		JF.debug('JF.fillTemplate: Wrong input arguments', arguments);
		return;
	}
	let self = this;
	self.fillObject = function (base, input, parent) {
		for (let id in input) {
			self.updateObject(base, input[id]);
		}
		let clone = base.cloneNode(true);
		if (clone instanceof HTMLElement) {
			parent.appendChild(clone);
		}
	};
	self.updateObject = function (base, name, value) {
		let self = this;
		if (base.hasOwnProperty('name')) {
			if (base.name === name) {
				if (typeof value === 'string' || typeof value === 'number') {
					base.text = value.toLocaleString();
				} else if (typeof value === 'object') {
					base = self.fillObject(base, value);
				}
			}
		}
		for (let key in base) {
			if (typeof base[key] === 'object') {
				if (base[key].nodeType === undefined) {
					self.updateObject(base[key], name, value);
				} else {
					if (base[key].name === name) {
						base[key].text = value;
					}
				}
			}
		}
	};
	self.iterateOverrides = function (base, overrides) {
		let id;
		let self = this;
		for (id in overrides) {
			if (overrides.hasOwnProperty(id) && typeof overrides[id] !== 'function') {
				let name = id;
				let value = overrides[id];
				if (base.hasOwnProperty('name')) {
					if (base.name === name) {
						if (typeof value === 'string' || typeof value === 'number') {
							base.text = String(value);
						} else if (typeof value === 'object') {
							base = self.fillObject(base, self.parent, value);
						}
					}
				}
				self.parent = base;
				self.updateObject(base, name, value);
			}
		}
	};
	self.convertToObject = function () {
		let self = this;
		try {
			let overrides = JSON.parse(arguments[1]);
			self.iterateOverrides(arguments[0], overrides);
		} catch (error) {
			console.warn(error);
		}
	};
	let $mode = typeof arguments[1];
	$mode === 'string' ?
		this.convertToObject(arguments[0], arguments[1])
		: $mode === 'object' ?
			this.iterateOverrides(arguments[0], arguments[1])
			: console.warn('non defined input');
};
/*
 * Creator functionality initialization
 * needed to create style tag on page to be able to create css properties for templates

 * @returns {undefined} */
JF.init = function () {
	/*
	 INITIALIZATION
	 */
	let style = {
		id: 'style',
		element: 'style',
		defer: 'defer',
		type: 'text/css'
	};
	JF(style);
	let head = document.getElementsByTagName('head')[0];
	if (JF.templates.style.html instanceof HTMLElement) {
		head.insertBefore(JF.templates.style.html, head.childNodes[0]);
	}
	JF.templates.templates = undefined;
	// JF.style = JF.templates.style.html.sheet;
};
/*
 * JF controller section
 * used to create comunication between template and page interractions to avoid custom / global functions
 * @returns {Array|JF.$returnObject|Boolean} */
JF.controller = function (controller, command, callback, save) {
	if (typeof controller === 'undefined') {
		return false;
	}
	if (typeof JF.controllers[controller] === 'undefined') {
		JF.controllers[controller] = {};
		JF.controllers[controller].listeners = [];
	}
	if (typeof callback !== 'function' && typeof command !== 'string' && typeof controller === 'string') {
		let $return = 'Available commands: ';
		let str = '';
		for (let id in JF.controllers[controller]) {
			if (typeof JF.controllers[controller][id] === 'object') {
				str += id + ";";
			}
		}
		return str !== '' ? $return + str : "No available commands";
	} else if (typeof callback !== 'function' && typeof command === 'string' && typeof controller === 'string') {
		if (typeof JF.controllers[controller][command] !== 'undefined') {
			JF.controllers[controller][command].callback();
		} else {
			JF.controllers[controller].listeners.push(command);
			return 'No callbacks available. Adding to queue list. Once function gets in, it will be executed immidiatelly.';
		}
	} else if (typeof callback === 'function' && typeof command === 'string' && typeof controller === 'string') {
		if (typeof JF.controllers[controller][command] === 'undefined') {
			JF.controllers[controller][command] = [];
		}
		JF.controllers[controller][command].callback = callback;
		for (let index in JF.controllers[controller].listeners) {
			if (JF.controllers[controller].listeners[index] === command) {
				if (save === false) {
					JF.controllers[controller].listeners.splice(index, 1);
				}
				JF.controllers[controller][command].callback();
				break;
			}
		}
	}
	return true;
};

export default JF;