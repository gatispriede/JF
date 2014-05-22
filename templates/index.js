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
    id: "home",
    override: true,
    style: "background: gray",
    body:    {
        element:     "div",
        class:       "JF",
        "title":       {
            "element": "h1",
            style: {
                color: "red",
                "font-size": '30px'
            },
            name: "post_type",
            "value":   "My new jFunisimo Library based on JavaScript."
        },
        "description": {
            "element": "h2",
            name: 'found_posts',
            "value": "Welcome",
            style: 'background: blue'
        },
        "listItems":   {
            onclick: function(){console.log('cool stuff!')},
            "element": "ol",
            "class":   "ol list__todo",
            "text1":   {
                "element": "li",
                class: "old",
                name: "key",
                style: "color: blue",
                "value":   "Create template filling function"
            },
            "text2":   {
                "element": "li",
                "value":   "create filling generator",
                class: "new",
                style: {
                    color: "red",
                    "font-size": '65px'
                }
            }
        },
        postList:{
            element: "ol",
            name: "posts"
        }
    }
}
Creator(document.body,home);