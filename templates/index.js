var hidden = {
    element: 'div',
    data: 'layers/hidden.html',
    type: 'text/html',
    id: 'hidden',
    title: {
        element: 'h1',
        text: 'Hidden Layer'
    }
}
var fixed = {
    element: 'div',
    data: 'layers/fixed.html',
    type: 'text/html',
    id: 'fixed',
    title: {
        element: 'h1',
        text: 'fixed Layer'
    }
}
var loader = {
    element: 'div',
    data: 'layers/loader.html',
    type: 'text/html',
    id: 'loader',
    title: {
        element: 'h1',
        text: 'loader Layer'
    }
}
var base = {
    element: 'div',
    data: 'layers/index.html',
    type: 'text/html',
    id: 'base',
    title: {
        element: 'h1',
        text: 'index Layer'
    }
}
var home = {
    element: "div",
    id: "home",
    body:    {
        element:     "div",
        class:       "jFunisimo",
        "title":       {
            "element": "h1",
            name: "post_type",
            "text":   "TODO list:"
        },
        "description": {
            "element": "h2",
            name: 'found_posts',
            "text": "Welcome",
	        onmouseover: function(){console.log('cool stuff!')},
	        onclick: function(){console.log('cool stuff!')}
        },
        "listItems":   {
            onclick: function(){console.log('cool stuff!')},
            "element": "ol",
            "class":   "ol list__todo",
            style: {
            	display: "block",
            	background: "gray"
            },
            "text1":   {
                "element": "li",
                name: "key",
                style: "color: blue",
                inlineStyle: {
                	color: 'red',
                	background: "white"
                },
                "text":   "Create template filling function" + Date()
            },
            "text2":   {
                "element": "li",
                "text":   "create filling generator"
            }
        },
        postList:{
            element: "ol",
            name: "posts"
        }
    }
}
Creator(document.body,home);
