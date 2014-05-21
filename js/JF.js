/**
 * Created by Gatis.Priede on 5/12/14.
 */
var JF = function(){};
JF.debug = function(){
	if(typeof arguments[0] !== 'undefined'){
		if(typeof JF.debug.items == 'undefined'){
			JF.debug.items = {};
		}
		JF.debug.items[Date()] = {
			message: arguments[0],
			content: arguments[1]
		};
		return true;
	}
	return (JF.debug.items);
}
var filters = function(){};
Object.defineProperty(filters,'tags',{
    enumerable: true,
    configurable: false,
    set: function(){
        if(type(arguments[0]) == 'string'){
            if(arguments[0].test(this.tags)){
                this.tags =+ arguments[0] + ';';
            }
        }else{
            return ;
        }
    },
    get: function(){
        return this.tags;
    }
});
var Creator = function() {
    if( typeof arguments[0] == 'undefined' ){
        return false;
    }
    var $parent = {};
    var $i = 0;
    var $append = false;
    if(arguments[0].nodeType){
        $parent = arguments[0];
        $append = true;
        $i = 1;
    }
    var $input = arguments[$i];
    while(typeof $input == 'object'){
        var $element = Creator.element(Creator.clone(arguments[$i]));
        if($append){
            $parent.appendChild($element);
        }
        $i++;
        $input = arguments[$i];
    }
    return true;
};
Creator.prototype = Object.prototype;
var Template = function(){};
Template.prototype = Object.prototype;
Template.prototype.add = function(){
    if( typeof arguments[0] == 'undefined' ){
        return false;
    }
    var $input = {};
    var $i = 0;
    while(typeof $input === 'object'){
        $input = arguments[$i];
        arguments[0].appendChild(this);
        $i++;
    }
};
Template.createEvents =function(){
    Object.defineProperty(arguments[0],'value',{
        enumerable:true,
        configurable: true,
        set: function(){
            if(typeof arguments[0] == 'string'){
                this.childNodes[0].textContent = arguments[0];
            }else if(typeof arguments[0] == 'object'){
                this.appendChild(Creator(arguments[0]));
            }

        },
        get: function(){
            return this.childNodes[0].textContent;
        }
    });
    Object.defineProperty(arguments[0],'class',{
        enumerable:true,
        configurable: true,
        set: function(){
            this.className = arguments[0];
        },
        get: function(){
            return this.className;
        }
    });
    arguments[0].prototype.filters = filters;
};
Creator.prototype.clone = function() {
	// Handle the 3 simple types, and null or undefined
	if (null == arguments[0] || "object" != typeof arguments[0]) return arguments[0];

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
			if (arguments[0].hasOwnProperty(attr)) copy[attr] = Creator.clone(arguments[0][attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
}
Creator.prototype.element = function () {
    if(typeof arguments[0] !== 'object'){
        return ;
    }
    var $object = arguments[0];
    var element;
    /*
    Define element, or parent element
     */
    if(typeof arguments[2] == 'undefined'){
	    if(typeof JF.templates == 'undefined'){
		    Object.defineProperty(JF,'templates',{
                value: {}
            });
	    }
        if($object.override == true && typeof $object.id !== 'undefined' && JF.templates[$object.id]) {
            JF.templates[$object.id].template.remove();
        }
        if(typeof $object.id == 'undefined'){
            $object.id = ( Math.floor(Math.random()*1000) ) + Date.now();
        }else if(typeof JF.templates[$object.id] !== 'undefined' && $object.override != true ){
	        $object.id = ( Math.floor(Math.random()*1000) ) + Date.now();
        }
        this.id = $object.id;
        JF.templates[this.id] = {
            elements: {},
            name: this.id,
            template: {}
        };
        var doc = document.createDocumentFragment();
            element = document.createElement($object.element);
            doc.appendChild(element);
        var $iteration = 0;
    }else{
            element = document.createElement($object.element);
        $iteration = arguments[2] + 1;
    }
    this.type = $object.element;
    /*
    Apply properties to element
     */
    if (typeof $object == 'object') {
        if($object.id){
            element.name = $object.id;
        }
        for($key in $object) {
            if (typeof $object[$key] == 'string' || typeof $object[$key] == 'function') {
                if($key == 'value'){
//                    element['name'] = $object.element;
                    element['textContent'] = $object[$key];
                        delete $object[$key];
                }else if($key == 'filters'){
                }else if($key == 'style'){
                    var $rule = "#" + this.id + " " + this.type + " { ";
                    $rule += $object[$key] + ';';
                    $rule += "}";
                    console.log($rule)
                    JFstyle.insertRule($rule,1);
                }else{
                    element[$key] = $object[$key];
                        delete $object[$key];
                }
            }else if(typeof $object[$key] == 'object'){
                if($key == 'style'){
                    var $rule = "#" + this.id + " " + this.type + " { ";
                    for(rule in $object[$key]){
                        if(typeof $object[$key][rule] !== 'function'){
                            $rule += rule+":"+$object[$key][rule]+"; ";
                        }
                    }
                    $rule += "}";
                    JFstyle.insertRule($rule,0);
                }else{
                    var elementName = $key;
                    var subElement = Creator.element($object[$key],$object,$iteration);
                        element.appendChild(subElement);
                    JF.templates[this.id].elements[elementName] = subElement;
                    /*
                     Apply Template Prototypes
                     */
                    JF.templates[this.id].elements[elementName].prototype = Template.prototype;
                    Template.createEvents(JF.templates[this.id].elements[elementName]);
                        delete $object[$key];
                }
            }
        }
        if(typeof doc !== 'undefined'){
            return JF.templates[this.id].template = element;
        }else {
            return element;
        }
    }
    return false;
};
/*
	1 argument(@object) = template which needs to be filled
	2 argument(@object/@string/@json)
 */
Creator.prototype.fillTemplate = function () {
	if(typeof arguments[0] !== 'object' || typeof arguments[1] == 'undefined'){
		JF.debug('Creator.fillTemplate: Wrong input arguments',arguments);
		return ;
	}
    this.generateElements = function(base,input){
        var type = base.element;
        switch (type) {
            case('ol'):
                for(id in input){
                    if(typeof input[id] == 'function'){
                        continue;
                    }
                    if(typeof input[id] == 'object'){
                        base[id] = input[id];
                    }
                    if(base[id]['element']){
                        base[id]['element'] = 'li';
                    }
                }
                return base;
            case('table'):
                for(id in input){
                    if(typeof input[id] == 'function'){
                        continue;
                    }
                    if(typeof input[id] == 'object'){
                        base[id] = input[id];
                    }
                    if(base[id]['element']){
                        base[id]['element'] = 'td';
                    }
                }
                return base;
            case('div'):
                for(id in input){
                    if(typeof input[id] == 'function'){
                        continue;
                    }
                    if(typeof input[id] == 'object'){
                        base[id] = input[id];
                    }
                    if(base[id]['element']){
                        base[id]['element'] = 'span';
                    }
                }
                return base;
            default :
                return input;
        }
    }
    this.updateObject = function(base,name,value){
        if(base.hasOwnProperty('name')){
            if(base.name === name){
                if(typeof value == 'string' || typeof value == 'number'){
                    base.value = value.toLocaleString();
                }else if(typeof value == 'object'){
                    base = this.generateElements(base,value);
                }
            }
        }
        for(key in base){
            if(typeof base[key] == 'object'){
                if(typeof base[key].nodeType == 'undefined'){
                    this.updateObject(base[key],name,value);
                }else{
                    if(base[key].name == name){
                        base[key].value = value;
                    }
                }
            }
        }
    }
    this.iterateOverrides = function(base,overrides){
        for(id in overrides){
            if(overrides.hasOwnProperty(id) && typeof overrides[id] !== 'function' ){
                var name = id;
                var value = overrides[id];
                if(base.hasOwnProperty('name')){
                    if(base.name === name){
                        if(typeof value == 'string' || typeof value == 'number'){
                            base.value = value.toLocaleString();
                        }else if(typeof value == 'object'){
                            base = this.generateElements(base,value);
                        }
                    }
                }
                this.updateObject(base,name,value);
            }
        }
    }
    this.convertToObject = function(){
        try{
            var overrides = JSON.parse(arguments[1])
            this.iterateOverrides(arguments[0],overrides);
        }catch(error){
            console.warn(error);
        }
    }
	var $mode = typeof arguments[1];
	$mode == 'string' ?

        this.convertToObject(arguments[0],arguments[1])

    : $mode == 'object' ?

        this.iterateOverrides(arguments[0],arguments[1])

    : console.warn('non defined input');
};
Creator.prototype.init = function(){
    /*
     INITIALIZATION
     */
    var style = {
        id: 'style',
        element: 'style',
        defer: 'defer',
        type: 'text/css'
    };
    var core = {
        id: 'core',
        element: 'script',
        defer: 'defer',
        src: 'js/core.js',
        type: 'application/x-javascript'
    };
    var templates = {
        id: 'templates',
        element: 'script',
        defer: 'defer',
        src: 'templates/index.js',
        type: 'application/x-javascript'
    };
    Creator(document.head,core,templates);
    Creator(style);
    document.head.insertBefore(JF.templates.style.template,document.head.childNodes[0]);
    delete JF.templates.core;
    delete JF.templates.templates;
}
Creator.init();
Object.defineProperty(this,'JFstyle',{
    enumerable:true,
    configurable:false,
    writable:true,
    value: JF.templates.style.template.sheet
});
delete JF.templates.style;