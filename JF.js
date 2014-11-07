/**
 * Copyright (C) 2014 Funisimo
 */
/* global JF,JFstyle,JFcore*/
var JF = function () {
};
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
var JFcore = {
    init: function () {
        JFcore.createJF();
        JF.status = 'Init';
        JFcore.createGlobalFunctions();
        JFcore.createGlobalFunctions.description = 'Creates Global functions';
        JF.watch('status', JF.setStatus);
        JF.status = "Done loading Framework";
        JFcore.init = null;
        JFcore = null;
    },
    createJF: function () {
        JF.events = {};
        JF.stringify = function () {
            var $iteration = 0;
            if (typeof arguments[1] !== 'undefined') {
                $iteration = arguments[1] + 1;
            }
            var $result = '{';
            for (var id in arguments[0]) {
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
            //			console.warn ( 'Add read-only property ' + arguments[1] );
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
            //			console.warn ( 'Add public property ' + arguments[1] );
        };
        JF.setStatus = function () {
            status = arguments[2];
        };
        return true;
    },
    createGlobalFunctions: function () {
        function Global() {
            var object = arguments[0];
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
        }
        ;
        var global = {
            name: 'log',
            value: function () {
                console.log(arguments);
            }
        };
        Global(global);
        global = {
            name: 'clearTimeouts',
            value: function () {
                for (var i = 1; i < 1000; i++) {
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
                        case(1):
                        {
                            return ("ELEMENT_NODE");
                        }
                        case(2):
                        {
                            return ("ATTRIBUTE_NODE");
                        }
                        case(3):
                        {
                            return ("TEXT_NODE");
                        }
                        case(4):
                        {
                            return ("CDATA_SECTION_NODE");
                        }
                        case(5):
                        {
                            return ("ENTITY_REFERENCE_NODE");
                        }
                        case(6):
                        {
                            return ("ENTITY_NODE");
                        }
                        case(7):
                        {
                            return ("PROCESSING_INSTRUCTION_NODE");
                        }
                        case(8):
                        {
                            return ("COMMENT_NODE");
                        }
                        case(9):
                        {
                            return ("DOCUMENT_NODE");
                        }
                        case(10):
                        {
                            return ("DOCUMENT_TYPE_NODE");
                        }
                        case(11):
                        {
                            return ("DOCUMENT_FRAGMENT_NODE");
                        }
                        case(12):
                        {
                            return ("NOTATION_NODE");
                        }
                        default :
                        {
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
                writable: false,
                value: function (prop, handler) {
                    var oldval = this[prop],
                            newval = oldval,
                            getter = function () {
                                return newval;
                            },
                            setter = function (val) {
                                oldval = newval;
                                return newval = handler.call(this, prop, oldval, val);
                            };
                    if (delete this[prop]) { // can't watch constants
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
        enumerable: false, configurable: true, writable: false, value: function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
    Object.unwatch.description = 'Deletes watcher for property';
}
JFcore.init();
/*
 * Template definition used in creating html elements with predefined functionality
 * @returns {undefined} 
 * */
var Template = function () {
};
Template.add = function () {
    if (typeof arguments[0] === 'undefined') {
        return false;
    }
    var $input = {};
    var $i = 0;
    while (typeof $input === 'object') {
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
                var container = element.configuration.container.getBoundingClientRect();
                element.container = {
                    left: parseInt(container.left),
                    top: parseInt(container.top),
                    right: parseInt(container.right),
                    bottom: parseInt(container.bottom),
                    width: parseInt(container.width),
                    height: parseInt(container.height)
                };
            } else {
                var container = window.getBoundingClientRect();
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
        var e = window.event || e;
        element.style.position = 'relative';
        element.style.float = 'left';
        var elementDimensions = element.getBoundingClientRect();
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

    var dragTarget = element.setCapture ? element : window;

    JF.events.addListener(dragTarget, "mousemove", function (e) {
        if (!element.dragging)
            return;

        var e = window.event || e;
        var top = e.clientY - element.container.top - (element.getBoundingClientRect().height / 2);
        var left = e.clientX - element.container.left - (element.getBoundingClientRect().width / 2);
        var right = left + element.dragging.width;
        var bottom = top + element.dragging.height;

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
    var element = arguments[0];
    if (typeof arguments[1] !== 'undefined') {
        var props = arguments[1];
    }
    element.onmousedown = function (event) {
        var src = event.srcElement;
        var clone = src.cloneNode(true);
        JF.templates.page.html.insertBefore(clone, JF.templates.page.html.firstChild);
        var properties = {
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
                    this.appendChild(Creator(arguments[0]));
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
            var self = this;
            if (typeof arguments[0] === 'string') {
                self.childNodes[0].textContent = arguments[0];
            } else if (typeof arguments[0] === 'object') {
                self.appendChild(Creator(arguments[0]));
            } else {
                if (self.childNodes) {
                    return self.childNodes[0].textContent;
                }
            }
        })();
        arguments[0]['class'] = (function () {
            var self = this;
            if (typeof arguments[0] === 'string') {
                self.childNodes[0].textContent = arguments[0];
            } else if (typeof arguments[0] === 'object') {
                self.appendChild(Creator(arguments[0]));
            } else {
                return self.className;
            }
        })();
    }
};

/*
 * JF controller section
 * used to create comunication between template and page interractions to avoid custom / global functions
 * @returns {Array|Creator.$returnObject|Boolean} */
var Controller = function (controller, command, callback ,save) {
    if (typeof controller === 'undefined') {
        return false;
    }
    if (typeof JF.controllers[controller] === 'undefined') {
        JF.controllers[controller] = {};
        JF.controllers[controller].listeners = [];
    }
    if (typeof callback !== 'function' && typeof command !== 'string' && typeof controller === 'string') {
        var $return = 'Available commands: ';
        var str = '';
        for (var id in JF.controllers[controller]) {
            if (typeof JF.controllers[controller][id] === 'object') {
                str += id + ";";
            }
        }
        return str !== '' ? $return + str : "No available commands";
    } else if (typeof callback !== 'function' && typeof command === 'string' && typeof controller === 'string') {
        if (typeof JF.controllers[controller][command] !== 'undefined') {
            JF.controllers[controller][command].callback();
        }else{
            JF.controllers[controller].listeners.push(command);
            return 'No callbacks available. Adding to queue list. Once function gets in, it will be executed immidiatelly.';
        }
    } else if (typeof callback === 'function' && typeof command === 'string' && typeof controller === 'string') {
        if (typeof JF.controllers[controller][command] === 'undefined') {
            JF.controllers[controller][command] = [];
        }
        JF.controllers[controller][command].callback = callback;
        for(var index in JF.controllers[controller].listeners){
            if(JF.controllers[controller].listeners[index] === command){
                if(save === false){
                    JF.controllers[controller].listeners.splice( index, 1 );
                }
                JF.controllers[controller][command].callback();
                break;
            }
        }
    }
    return true;
};
Controller.init = function () {
    if (JF === undefined) {
        delete Controller;
        return false;
    }
    JF.controllers = function () {
    };
}();
/*
 * Creates "Creator" global object used to parse json into html
 * Holds key functionality
 * 
 * @returns {Array|Creator.$returnObject|Boolean} */
var Creator = function () {
    if (typeof arguments[0] === 'undefined') {
        return false;
    }
    var $parent = {};
    var $i = 0;
    var $append = false;
    if (arguments[0] instanceof HTMLElement) {
        $parent = arguments[0];
        $append = true;
        $i = 1;
    }
    var $input = arguments[$i];
    var $returnObject = [];
    while ($input instanceof Object) {
        if (arguments[$i].save === true && JF.templates[arguments[$i].id] !== undefined) {
            $element = JF.templates[arguments[$i].id].html;
            $returnObject.push(arguments[$i].id);
        } else {
            var $element = Creator.element(Creator.clone(arguments[$i]));
            $returnObject.push($element.id);
        }
        if ($append) {
            $parent.appendChild($element);
            if (JF.templates[$element.id].funcArr !== undefined) {
                for (var $id in JF.templates[$element.id].funcArr) {
                    var func = JF.templates[$element.id].funcArr[$id].func;
                    var element = JF.templates[$element.id].funcArr[$id].element;
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
/*
 * Main function for copying the attributes of incomming elements
 * used in creation, filling template and indexing html
 
 * @returns {Array|Creator.clone.copy|Arguments} */
Creator.clone = function () {
    // Handle the 3 simple types, and null or undefined
    if (null === arguments[0] || "object" !== typeof arguments[0])
        return arguments[0];

    // Handle Date
    if (arguments[0] instanceof Date) {
        var copy = new Date();
        copy.setTime(arguments[0].getTime());
        return copy;
    }

    // Handle Array
    if (arguments[0] instanceof Array) {
        var copy = [];
        for (var i = 0, len = arguments[0].length; i < len; i++) {
            copy[i] = Creator.clone(arguments[0][i]);
        }
        return copy;
    }

    // Handle Object
    if (arguments[0] instanceof Object) {
        var copy = {};
        for (var attr in arguments[0]) {
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
 
 * @returns {Creator.element.element|Element|Creator.element.$object|Arguments|JF.templates.htmlelement|Boolean|undefined} */
Creator.element = function () {
    if (typeof arguments[0] !== 'object') {
        return;
    }
    var $object = arguments[0];
    var element;
    var ruleName;
    var $rule;
    var $key;
    /*
     Define element, or parent element
     */
    if (arguments[2] === undefined) {
        delete this.class;
        if (JF.templates === undefined) {
            Object.defineProperty(JF, 'templates', {
                value: {}
            });
        }
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
            template: Creator.clone(arguments[0])
        };
        JF.templates[this.id].remove = function () {
            JF.templates[this.name].html !== undefined ? this.html.remove() : '';
            JF.templates[this.name].cssRules = JF.templates[this.name].cssRules.reverse();
            if (JF.templates[this.name].cssRules[0] !== undefined) {
                for (var id in JF.templates[this.name].cssRules) {
                    JF.templates[this.name].cssRules[id].remove();
                }
                ;
            }
            ;
            delete JF.templates[this.name];
        };
        var doc = document.createDocumentFragment();
        element = document.createElement($object.element);
        doc.appendChild(element);
        var $iteration = 0;
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
        for (var $key in $object) {
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
                                var $styles = $object[$key].split(';');
                                for (var $style in $styles) {
                                    var inlineRule = $styles[$style].replace(';', '').split(':');
                                    element.style[inlineRule[0]] = inlineRule[1];
                                }
                            } else {
                                var inlineRule = $object[$key].replace(';', '').split(':');
                                element.style[inlineRule[0]] = inlineRule[1];
                            }
                        } catch (error) {
                            console.log(error);
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
                    for (var rule in $object[$key]) {
                        if (typeof $object[$key][rule] !== 'function') {
                            $rule += rule + ":" + $object[$key][rule] + ";";
                        }
                    }
                    $rule += "}";
                    $rule = $rule.replace(' . ', ' ');
                    this.cssRules += "........" + $rule;
                } else if ($key.toLowerCase() === 'inlinestyle') {
                    for (var rule in $object[$key]) {
                        if (typeof $object[$key][rule] !== 'function') {
                            try {
                                element.style[rule] = $object[$key][rule].replace(';', '');
                            } catch (error) {
                                JF.debug(error);
                            }
                        }
                    }
                } else if ($key === 'data') {
                    element['data'] = Creator.clone($object[$key]);
                } else {
                    var elementName = $key;
                    var subElement = Creator.element($object[$key], $object, $iteration);
                    element.appendChild(subElement);
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
                    delete JF.templates[this.id];
                    return element;
                }
            } else {
                if (this.cssRules !== "" && this.cssRules !== undefined) {
                    var split = this.cssRules.split("........");
                    delete split[0];
                    for (var rule in split) {
                        var item = split[rule];
                        if (typeof item === 'string' && item !== undefined && item !== "" && item !== " ") {
                            JF.templates[this.id].cssRules.push(JFstyle.addStyle(item));
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
 * @returns {Creator.createTemplate.$return|Creator.createTemplate.value|$input.attributes.textContent} */
Creator.createTemplate = function ($input) {
    var $key, $attribute;
    if (typeof arguments[1] === 'undefined') {
        var $return = {};
        var $iteration = 0;
    } else {
        $iteration = arguments[1];
    }
    if ($input instanceof HTMLElement) {
        $return = {
            element: $input.localName,
            text: typeof $input.childNodes[0] === 'undefined' ? '' : $input.childNodes[0].textContent
        };
        $input.name !== undefined ? $return.name = $input.name : '';
        for ($attribute in $input.attributes) {
            if ($input.attributes.hasOwnProperty($attribute) && $attribute !== 'length') {
                var name = $input.attributes[$attribute].nodeName;
                var value = $input.attributes[$attribute].textContent;
                $return[name] = value;
            }
        }
        for ($key in $input.childNodes) {
            if ($input.childNodes.hasOwnProperty($key) && $key !== 'length') {
                if ($input.childNodes[$key].nodeType === 1) {
                    $iteration++;
                    $return[$iteration] = Creator.createTemplate($input.childNodes[$key], $iteration);
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
Creator.indexElements = function ($input, $parent) {
    var $key;
    if ($parent === undefined) {
        $parent = {};
    }
    if (arguments[2] === undefined) {
        var $iteration = 0;
    } else {
        $iteration = arguments[2];
    }
    if ($input instanceof HTMLElement) {
        for ($key in $input.childNodes) {
            if ($input.childNodes.hasOwnProperty($key) && $key !== 'length') {
                if ($input.childNodes[$key].nodeType === 1) {
                    $parent[$iteration] = $input.childNodes[$key];
                    $iteration++;
                    Creator.indexElements($input.childNodes[$key], $parent, $iteration);
                }
            }
        }
    }
    return $parent;
};
/*
 * used to index html elements within box of parent input
 
 * @returns {undefined|Boolean} */
Creator.indexHtml = function () {
    if (arguments[0] === 'undefined') {
        return;
    }
    var $i = 0;
    var $template = {};
    var $input = arguments[$i];
    while ($input instanceof HTMLElement) {
        $template = {
            elements: Creator.indexElements($input),
            html: $input,
            name: $input.id || Math.round(Date.now() + Math.random() * 1000),
            template: Creator.createTemplate($input)
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
Creator.fillTemplate = function () {
    if (arguments[0] !== object || arguments[1] === undefined) {
        JF.debug('Creator.fillTemplate: Wrong input arguments', arguments);
        return;
    }
    var self = this;
    self.fillObject = function (base, input, parent) {
        for (var id in input) {
            self.updateObject(base, input[id]);
        }
        var clone = base.cloneNode(true);
        parent.appendChild(clone);
    };
    self.updateObject = function (base, name, value) {
        var self = this;
        if (base.hasOwnProperty('name')) {
            if (base.name === name) {
                if (typeof value === 'string' || typeof value === 'number') {
                    base.text = value.toLocaleString();
                } else if (typeof value === 'object') {
                    base = self.fillObject(base, value);
                }
            }
        }
        for (var key in base) {
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
        var id;
        var self = this;
        for (id in overrides) {
            if (overrides.hasOwnProperty(id) && typeof overrides[id] !== 'function') {
                var name = id;
                var value = overrides[id];
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
        var self = this;
        try {
            var overrides = JSON.parse(arguments[1]);
            self.iterateOverrides(arguments[0], overrides);
        } catch (error) {
            console.warn(error);
        }
    };
    var $mode = typeof arguments[1];
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
Creator.init = function () {
    /*
     INITIALIZATION
     */
    var style = {
        id: 'style',
        element: 'style',
        defer: 'defer',
        type: 'text/css'
    };
    Creator(style);
    var head = document.getElementsByTagName('head')[0];
//    head.insertBefore(JF.templates.templates.html,head.childNodes[0]);
    head.insertBefore(JF.templates.style.html, head.childNodes[0]);
    delete JF.templates.templates;
}();
//Creator.init();
/*
 * Global style definition for easier style accessability within templates and also document
 */
Object.defineProperty(this, 'JFstyle', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: JF.templates.style.html.sheet
});
delete JF.templates.style;
/*
 * add style functionality used by templates
 */
JFstyle.addStyle = function ($newRule) {
    var place = JFstyle.rules.length;
    JFstyle.insertRule($newRule, place);
    var obj = {
        place: place,
        rule: JFstyle.rules[place]
    };
    obj.remove = function () {
        JFstyle.removeRule(this.place);
    };
    if (typeof arguments[1] === 'string') {
        JF.templates[arguments[1]].cssRules.push(obj);
    }
    return obj;
};
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
}
(JF.initEvents = function () {
    if (document.readyState === 'interactive') {
        var time = setTimeout(JF.initEvents, 100);
    } else {
        if (document.readyState === 'complete') {
            JF.createEvents();
        }
    }
}());