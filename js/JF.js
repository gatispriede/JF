/**
 * Created by Gatis.Priede on 5/12/14.
 */
var JF = function(){};
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
        var $element = Creator.element(arguments[$i]);
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
}
Template.createEvents =function(){
    Object.defineProperty(arguments[0],'value',{
        enumerable:true,
        configurable: true,
        set: function(){
            this.childNodes[0].textContent = arguments[0];
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
        if(typeof $object.id == 'undefined'){
            $object.id = ( Math.floor(Math.random()*1000) ) + Date.now();
        }
        this.id = $object.id;
        if(typeof JF.templates == 'undefined'){
            JF.templates = {};
        }
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
    /*
    Apply properties to element
     */
    if (typeof $object == 'object') {
        if($object.id){
            element.name = $object.id;
        }
        for($key in $object) {
            if (typeof $object[$key] == 'string') {
                if($key == 'value'){
                    element['name'] = $object.element;
                    element['textContent'] = $object[$key];
                        delete $object[$key];
                }else if($key == 'filters'){
                }else{
                    element[$key] = $object[$key];
                        delete $object[$key];
                }
            }else if(typeof $object[$key] == 'object'){
                JF.templates[this.id].elements[$key] = element;
                    /*
                    Apply Template Prototypes
                     */
                JF.templates[this.id].elements[$key].prototype = Template.prototype;
                    Template.createEvents(JF.templates[this.id].elements[$key]);
                var subElement = Creator.element($object[$key],$object,$iteration);
                    element.appendChild(subElement);
                    delete $object[$key];
            }
        }
        if(typeof doc !== 'undefined'){
            return JF.templates[this.id].template = element;
        }else {
            return element;
        }
    }
    return false;
}
Creator.prototype.fillTemplate = function () {
	if(typeof arguments[0] !== 'object'){
		return ;
	}
	var $object = arguments[0];
	var element;
	/*
	 Define element, or parent element
	 */
	if(typeof arguments[2] == 'undefined'){
		if(typeof $object.id == 'undefined'){
			$object.id = ( Math.floor(Math.random()*1000) ) + Date.now();
		}
		this.id = $object.id;
		if(typeof JF.templates == 'undefined'){
			JF.templates = {};
		}
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
	/*
	 Apply properties to element
	 */
	if (typeof $object == 'object') {
		if($object.id){
			element.name = $object.id;
		}
		for($key in $object) {
			if (typeof $object[$key] == 'string') {
				if($key == 'value'){
					element['name'] = $object.element;
					element['textContent'] = $object[$key];
					delete $object[$key];
				}else if($key == 'filters'){
				}else{
					element[$key] = $object[$key];
					delete $object[$key];
				}
			}else if(typeof $object[$key] == 'object'){
				JF.templates[this.id].elements[$key] = element;
				/*
				 Apply Template Prototypes
				 */
				JF.templates[this.id].elements[$key].prototype = Template.prototype;
				Template.createEvents(JF.templates[this.id].elements[$key]);
				var subElement = Creator.element($object[$key],$object,$iteration);
				element.appendChild(subElement);
				delete $object[$key];
			}
		}
		if(typeof doc !== 'undefined'){
			return JF.templates[this.id].template = element;
		}else {
			return element;
		}
	}
	return false;
}
/*
INITIALIZATION
 */
var core = {
    id: 'core',
    element: 'script',
    defer: 'defer',
    src: 'js/core.js',
    type: 'application/x-javascript'
}
var templates = {
    element: 'script',
    defer: 'defer',
    src: 'templates/index.js',
    type: 'application/x-javascript'
}
var style = {
    id: 'style',
    element: 'style',
    defer: 'defer',
    type: 'text/css'
}

Creator(document.head,core,templates,style);
Object.seal(JF.templates.core)