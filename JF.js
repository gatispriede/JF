/**
 * Copyright (C) 2014 Funisimo
 * 
 */
var JF = function() {
};
JF.debug = function() {
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
var JFcore = {
    init: function() {
        JFcore.createJF();
        JF.status = 'Init';
        JFcore.createGlobalFunctions();
        JFcore.createGlobalFunctions.description = 'Creates Global functions';
        JF.watch('status', JF.setStatus);
        JF.status = "Done loading Framework";
        JFcore.init = null;
        delete JFcore;
    },
    createJF: function() {
        JF.events = {};
        JF.stringify = function() {
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
        JF.private = function() {
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
        JF.public = function() {
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
        JF.setStatus = function() {
            status = arguments[2];
        };
        return true;
    },
    createGlobalFunctions: function() {
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
            value: function() {
                console.log(arguments);
            }
        };
        Global(global);
        global = {
            name: 'clearTimeouts',
            value: function() {
                for (var i = 1; i < 1000; i++) {
                    clearTimeout(i);
                }
            },
            description: 'Clears all timeouts'
        };
        Global(global);
        global = {
            name: 'type',
            value: function() {
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
            value: function() {
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
            value: function() {//checks if element is inside window
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
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch",
            {
                enumerable: false,
                configurable: true,
                writable: false,
                value: function(prop, handler) {
                    var oldval = this[prop],
                            newval = oldval,
                            getter = function() {
                                return newval;
                            },
                            setter = function(val) {
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
        enumerable: false, configurable: true, writable: false, value: function(prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
    Object.unwatch.description = 'Deletes watcher for property';
}
JFcore.init();
var Template = function() {
};
Template.add = function() {
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
JF.events.addListener = function(element, type, callback, capture) {
    if (element.addEventListener) {
        element.addEventListener(type, callback, capture);
    } else {
        element.attachEvent("on" + type, callback);
    }
};
Template.draggable = function(element, configuration) {
    element.dragging = null;
    if (configuration) {
        element.configuration = configuration;
    } else {
        element.configuration = {};
    }
    JF.events.addListener(element, "mousedown", function(e) {
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

    JF.events.addListener(element, "losecapture", function() {
        element.dragging = null;
    });
    JF.events.addListener(window, "mouseup", function(e) {
        element.dragging = null;
        element.removeEventListener('onmouseup');
        dragTarget.removeEventListener('onmousmove');
    }, true);

    var dragTarget = element.setCapture ? element : window;

    JF.events.addListener(dragTarget, "mousemove", function(e) {
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
Template.addDragging = function() {
    if (!arguments[0] instanceof HTMLElement) {
        console.log('wrong input');
        return false;
    }
    var element = arguments[0];
    if (typeof arguments[1] !== 'undefined') {
        var props = arguments[1];
    }
    element.onmousedown = function(event) {
        var src = event.srcElement;
        var clone = src.cloneNode(true);
        JF.templates.page.html.insertBefore(clone, JF.templates.page.html.firstChild);
        var properties = {
            container: JF.templates.page.html
        };
        Template.draggable(clone, properties);
    };
};
Template.createEvents = function() {
    try {
        Object.defineProperty(arguments[0], 'text', {
            enumerable: true,
            configurable: true,
            set: function() {
                if (typeof arguments[0] === 'string') {
                    this.childNodes[0].textContent = arguments[0];
                } else if (typeof arguments[0] === 'object') {
                    this.appendChild(Creator(arguments[0]));
                }

            },
            get: function() {
                if (this.childNodes[0]) {
                    return this.childNodes[0].textContent;
                }
            }
        });
        Object.defineProperty(arguments[0], 'class', {
            enumerable: true,
            configurable: true,
            set: function() {
                this.className = arguments[0];
            },
            get: function() {
                return this.className;
            }
        });
    } catch (error) {
        arguments[0]['text'] = (function() {
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
        arguments[0]['class'] = (function() {
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
var Creator = function() {
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
    while ($input instanceof Object) {
        var $element = Creator.element(Creator.clone(arguments[$i]));
        if ($append) {
            $parent.appendChild($element);
        }
        $i++;
        $input = arguments[$i];
    }
    return true;
};
Creator.clone = function() {
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
Creator.element = function() {
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
    if (typeof arguments[2] === 'undefined') {
        delete this.class;
        if (typeof JF.templates === 'undefined') {
            Object.defineProperty(JF, 'templates', {
                value: {}
            });
        }
//        if ($object.override === true && typeof $object.id !== 'undefined' && JF.templates[$object.id]) {
//            JF.templates[$object.id].template.remove();
//        }
        if (typeof $object.id === 'undefined') {
            $object.id = (Math.floor(Math.random() * 1000)) + Date.now();
        } else if (typeof JF.templates[$object.id] !== 'undefined' && typeof $object.override == 'undefined') {
            $object.id = (Math.floor(Math.random() * 1000)) + Date.now();
        }
        this.id = $object.id;
        JF.templates[this.id] = {
            elements: {},
            name: this.id,
            html: {},
            template: Creator.clone(arguments[0])
        };
        var doc = document.createDocumentFragment();
        element = document.createElement($object.element);
        doc.appendChild(element);
        var $iteration = 0;
    } else {
        element = document.createElement($object.element);
        $iteration = arguments[2] + 1;
    }
    this.type = $object.element;
    /*
     Apply properties to element
     */
    if (typeof $object === 'object') {
        typeof $object.class !== 'undefined' ? this.class = $object.class : '';
        typeof $object.id !== 'undefined' ? element.name = $object.id : '';
        for ($key in $object) {
            if (typeof $object[$key] === 'undefined') {
                break;
            }
            typeof $object[$key].class !== 'undefined' ? this.class = $object[$key].class : '';
            if (typeof $object[$key] === 'string' || typeof $object[$key] === 'function') {
                switch ($key) {
                    case('text'):
                        element['textContent'] = $object[$key];
                        break;
                    case('name'):
                        element.setAttribute('name', $object[$key])
                        break;
                    case('inlineStyle'):
                        try {
                            var inlineRule = $object[$key].split(':');
                            element.style[inlineRule[0]] = inlineRule[1];
                        } catch (error) {
                            console.log(error);
                        }
                        break;
                    case('style'):
                        if (typeof $object.class !== 'undefined') {
                            ruleName = " ." + $object.class.replace(' ', '.');
                        } else {
                            ruleName = typeof this.class !== 'undefined' ? " ." + this.class.replace(' ', '.') + " " + this.type : "";
                        }
                        $rule = '#' + this.id + ruleName + " { ";
                        $rule += $object[$key] + ';';
                        $rule += "}";
                        JFstyle.insertRule($rule, 0);
                        break;
                    case('class'):
                        element['className'] = $object[$key];
                        break;
                    case('data'):
                        element[$key] = $object[$key];
                        break;
                    default:
                        element[$key] = $object[$key];
                        break;
                }
            } else if (typeof $object[$key] === 'object') {
                if ($key === 'style') {
                    if (typeof $object.class !== 'undefined') {
                        ruleName = " ." + $object.class.replace(' ', '.');
                    } else {
                        ruleName = typeof this.class !== 'undefined' ? " ." + this.class.replace(' ', '.') + " " + this.type : "";
                    }
                    $rule = '#' + this.id + ruleName + " { ";
                    for (var rule in $object[$key]) {
                        if (typeof $object[$key][rule] !== 'function') {
                            $rule += rule + ":" + $object[$key][rule] + "; ";
                        }
                    }
                    $rule += "}";
                    JFstyle.insertRule($rule, 0);
                } else if ($key === 'inlineStyle') {
                    for (var rule in $object[$key]) {
                        if (typeof $object[$key][rule] !== 'function') {
                            try {
                                element.style[rule] = $object[$key][rule];
                            } catch (error) {
                                console.log(error);
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
            if (typeof this.id == 'number') {
                if ($object.save !== 'true' || $object.save !== true) {
                    delete JF.templates[this.id];
                    return element;
                }
            } else {
                return JF.templates[this.id].html = element;
            }
        } else {
            return element;
        }
    }
    return false;
};
Creator.createTemplate = function($input) {
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
        typeof $input.name !== 'undefined' ? $return.name = $input.name : '';
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
Creator.indexElements = function($input, $parent) {
    var $key;
    if (typeof $parent === 'undefined') {
        $parent = {};
    }
    if (typeof arguments[2] === 'undefined') {
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
Creator.indexHtml = function() {
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
        console.warn("Created Object,'JF.templates." + $template.name + "': ", JF.templates[$template.name])
        $i++;
        $input = arguments[$i];
    }
    return true;
};
/*
 1 argument(@object) = template which needs to be filled
 2 argument(@object/@string/@json)
 */
Creator.fillTemplate = function() {
    if (typeof arguments[0] !== 'object' || typeof arguments[1] === 'undefined') {
        JF.debug('Creator.fillTemplate: Wrong input arguments', arguments);
        return;
    }
    var self = this;
    self.fillObject = function(base, input, parent) {
        var id;
        for (id in input) {
            self.updateObject(base, input[id]);
        }
        var clone = base.cloneNode(true);

        parent.appendChild(clone);
    };
    self.updateObject = function(base, name, value) {
        var key;
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
        for (key in base) {
            if (typeof base[key] === 'object') {
                if (typeof base[key].nodeType === 'undefined') {
                    self.updateObject(base[key], name, value);
                } else {
                    if (base[key].name === name) {
                        base[key].text = value;
                    }
                }
            }
        }
    };
    self.iterateOverrides = function(base, overrides) {
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
    self.convertToObject = function() {
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

Creator.init = function() {
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
};
Creator.init();
Object.defineProperty(this, 'JFstyle', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: JF.templates.style.html.sheet
});
delete JF.templates.style;
JF.createEvents = function() {
    JF.mouse = {
        status: false
    };
    JF.keyboard = {
        status: false
    };
    JF.touch = {
        status: false
    };
    setMouseCoordinates = function(event) {
        JF.mouse.status = 'moving';
        JF.mouse.x = event.x;
        JF.mouse.y = event.y;
        JF.mouse.event = event;
    };
    setTouchCoordinates = function(event) {
        JF.touch.status = 'moving';
        JF.touch.x = event.x;
        JF.touch.y = event.y;
        JF.touch.event = event;
    };
    setMouseIdle = function() {
        JF.mouse.status = 'idle';
    };
    window.touchstart = function(event) {
        JF.touch.status = 'down';
    };
    window.touchend = function(event) {
        JF.touch.status = 'up';
    };
    window.touchenter = function(event) {
        JF.touch.status = 'enter';
    };
    window.touchleave = function(event) {
        JF.touch.status = 'leave';
    };
    window.touchmove = function(event) {
        this.setTouchCoordinates(event);
        setTimeout(setMouseIdle, 100);
    };
    window.onmousemove = function(event) {
        this.setMouseCoordinates(event);
        setTimeout(setMouseIdle, 100);
    };
    window.onmouseenter = function() {
        JF.mouse.state = 'enter';
        setTimeout(setMouseIdle, 100);
    };
    window.onmousedown = function() {
        JF.mouse.status = 'down';
        setTimeout(setMouseIdle, 100);
    };
    window.onmouseup = function() {
        JF.mouse.status = 'up';
        setTimeout(setMouseIdle, 100);
    };
    window.onmouseleave = function() {
        JF.mouse.state = 'leave';
        setTimeout(setMouseIdle, 100);
    };
}
(JF.initEvents = function() {
    if (document.readyState === 'interactive') {
        var time = setTimeout(JF.initEvents, 100);
    } else {
        if (document.readyState === 'complete') {
            JF.createEvents();
        }
    }
}());