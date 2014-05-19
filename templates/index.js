
var hidden = {
    element: 'div',
    data: 'layers/hidden.html',
    type: 'text/html',
    id: 'hidden',
    title: {
        element: 'h1',
        value: 'Hidden Layer'
    }
}
var fixed = {
    element: 'div',
    data: 'layers/fixed.html',
    type: 'text/html',
    id: 'fixed',
    title: {
        element: 'h1',
        value: 'fixed Layer'
    }
}
var loader = {
    element: 'div',
    data: 'layers/loader.html',
    type: 'text/html',
    id: 'loader',
    title: {
        element: 'h1',
        value: 'loader Layer'
    }
}
var base = {
    element: 'div',
    data: 'layers/index.html',
    type: 'text/html',
    id: 'base',
    title: {
        element: 'h1',
        value: 'index Layer'
    }
}
var home = {
    element: "div",
    value: 'hello',
    id: "home",
    body:    {
        element:     "div",
        className:       "jFunisimo",
	    onmouseover: function(){
		    var innerTemplate = Creator.clone(home);
	        console.log('this ',innerTemplate);
	    },
        "title":       {
            "element": "h1",
            "value":   "My new jFunisimo Library based on JavaScript."
        },
        "description": {
            "element": "h2",
            name: 'found_posts',
            "value":   "Welcome",
	        onclick: function(){console.log('cool stuff!')}
        },
        "listItems":   {
            onclick: function(){console.log('cool stuff!')},
            "element": "ol",
            "className":   "ol list__todo",
            "text1":   {
                "element": "li",
                "value":   "Create template filling function"
            },
            "text2":   {
                "element": "li",
                "value":   "create filling generator"
            }
        }
    }
}
JF.stringify = function(){
	var $iteration = 0;
	if(typeof arguments[1] == 'undefined'){

	}else{
		 $iteration++;
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
var lol = JF.stringify(home);
console.log(lol);
console.log(JSON.parse(lol));
//Creator.fillTemplate(home,'lol');
//Creator(document.body,home);