
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
        "title":       {
            "element": "h1",
            name: "post_type",
            "value":   "My new jFunisimo Library based on JavaScript."
        },
        "description": {
            "element": "h2",
            name: 'found_posts',
            "value": "Welcome",
	        onmouseover: function(){console.log('cool stuff!')},
	        onclick: function(){console.log('cool stuff!')}
        },
        "listItems":   {
            onclick: function(){console.log('cool stuff!')},
            "element": "ol",
            "className":   "ol list__todo",
            "text1":   {
                "element": "li",
                name: "key",
                "value":   "Create template filling function"
            },
            "text2":   {
                "element": "li",
                "value":   "create filling generator"
            }
        },
        postList:{
            element: "ol",
            name: "posts"
        }
    }
}
Creator(document.body,home);
Creator.indexHtml(JF.templates.home.html);