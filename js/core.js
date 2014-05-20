/**
 * Created by Gatis on 5/3/14.
 */
var core = {
	init: function () {
		core.createJF ();
		JF.status = 'Init';
		core.createGlobalFunctions ();
		core.createGlobalFunctions.description = 'Creates Global functions';
		JF.watch('status',JF.setStatus);
		JF.status = "Done loading Framework";
		console.warn ( 'JF is ready to roll!' );
		core.init = null;
		delete core;
	},
	createJF:              function () {
        JF.stringify = function(){
            var $iteration = 0;
            if(typeof arguments[1] !== 'undefined'){
                $iteration = arguments[1] + 1;
            }
            var $result = '{';
            for(id in arguments[0]) {
                switch (typeof arguments[0][id]){
                    case('string'):
                        $result += '"'+id+'"'+':'+'"'+arguments[0][id]+'",';
                        break;
                    case('object'):
                        $result += '"'+id+'"'+':'+''+JF.stringify(arguments[0][id],$iteration)+',';
                        break;
                    case('function'):
                        if(arguments[0].hasOwnProperty(id)){
                            arguments[0][id] = arguments[0][id].toLocaleString().replace('"',"\"").replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,"");
                            $result += '"'+id+'"'+':'+'"'+arguments[0][id]+'",';
                            break;
                        }
                }
            }
            $result += '}';
            $result = $result.replace(',}','}');
            return $result;
        };
		JF.private = function () {
			if ( typeof arguments[0] == 'undefined' || typeof arguments[1] == 'undefined' || typeof arguments[2] == 'undefined' ) {
				return false;
			}
			Object.defineProperty ( arguments[0], arguments[1], {
				writable:     false,
				enumerable:   false,
				configurable: false,
				value:        arguments[2]
			} );
			console.warn ( 'Add read-only property ' + arguments[1] );
		};
		JF.public = function () {
			if ( typeof arguments[0] == 'undefined' || typeof arguments[1] == 'undefined' || typeof arguments[2] == 'undefined' ) {
				return false;
			}
			Object.defineProperty ( arguments[0], arguments[1], {
				writable:     true,
				enumerable:   true,
				configurable: true,
				value:        arguments[2]
			} );
			console.warn ( 'Add public property ' + arguments[1] );
		};
		JF.setStatus = function(){
			status = arguments[2];
		};
		return true;
	},
	createGlobalFunctions: function () {
        function Global() {
            var object = arguments[0]
            if( typeof object == 'undefined' ){
                return false;
            }else if( typeof object == 'object' && typeof object.value !== 'undefined' && typeof object.name !== 'undefined' ){
                JF.public( this , object.name , object.value );
                if(typeof JF.global == 'undefined'){
                    JF.public ( JF, 'global', [] );
                }
                JF.global.push ( object.name );
                if(typeof object.description !== 'undefined'){
                    object.name.description = object.description;
                }
            }
        };
        var global = {
            name: 'log',
            value: function(){
                console.log(arguments)
            }
        };
        Global(global);
        global = {
            name: 'clearTimeouts',
            value: function () {
                for ( var i = 1; i < 1000; i++ ) {
                    clearTimeout ( i );
                }
            },
            description: 'Clears all timeouts'
        };
        Global(global);
        global = {
            name: 'type',
            value:function () {
                if ( typeof arguments[1] == 'undefined' ) {
                    return ({}).toString.call ( arguments[0] ).match ( /\s([a-zA-Z]+)/ )[1].toLowerCase ();
                } else if ( type ( arguments[0] ) == String ( '' + arguments[1] ) ) {
                    return true;
                }
                return false;
		    },
            description: 'Checks the input type'
        };
        Global(global);
        global = {
            name: 'isElement',
            value:function () {
                if ( type ( arguments[0].nodeType ) == 'undefined' ) {
                    return false;
                }
                if ( arguments[1] ) {
                    switch ( arguments[0].nodeType ) {
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
                if ( arguments[0].nodeType >= 0 ) {
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
                if ( typeof arguments[0] == 'undefined' ) {
                    return false
                }
                if ( document.all[0].clientHeight - arguments[0] < 0 ) {
                    return false;
                }
                return true;
            },
            description: "Checks if element is within window object by it's height"
        };
        Global(global);
	}
}
if ( !Object.prototype.watch ) {
    Object.defineProperty ( Object.prototype, "watch",
        {
            enumerable  : false,
            configurable: true,
            writable    : false,
            value       : function ( prop, handler ) {
                var oldval = this[prop],
                    newval = oldval,
                    getter = function () {
                        return newval;
                    },
                    setter = function ( val ) {
                        oldval = newval;
                        return newval = handler.call ( this, prop, oldval, val );
                    };
//                if ( delete this[prop] ) { // can't watch constants
//                    Object.defineProperty ( this, prop, {
//                        get: getter, set: setter, enumerable: true, configurable: true
//                    } );
//                }

            }
        } );
    Object.watch.description = 'Creates a watcher for Object property when value is changed: property,function';
}
if ( !Object.prototype.unwatch ) {// object.unwatch
    Object.defineProperty ( Object.prototype, "unwatch", {
        enumerable: false, configurable: true, writable: false, value: function ( prop ) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    } );
    Object.unwatch.description = 'Deletes watcher for property';
}
core.init ();