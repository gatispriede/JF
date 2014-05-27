var home = {
    element: "div",
    id: "home",
    body:    {
        element:     "div",
        class:       "JF",
        "title":       {
            "element": "h1",
            name: "post_type",
            "text":   "Welcome"
        },
        "description": {
            "element": "h2",
            name: 'found_posts',
            "text": "This content is created with JF framework",
	        onmouseover: function(){console.log('cool stuff!')},
	        onclick: function(){console.log('cool stuff!')}
        },
        "listItems":   {
            onmouseout: function(){console.log('cool stuff!')},
            "element": "ol",
            "class":   "ol",
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
                "text": "You can use 'Creator' function to call on template. All templates after creation process are available within 'JF.templates' Object. <b> To create template you must provide 'element' attribute for each element and follow JSON syntax rules<b>"
            },
            "text1":   {
                "element": "li",
                name: "key",
                style: "color: blue",
                inlineStyle: {
                	color: 'red',
                	background: "white"
                },
                "text": "You can use 'Creator' function to call on template."
            },
            "text2":   {
                "element": "li",
                "text":   "Help on available keys in JSON are available on Bitbucket https://bitbucket.org/funisimo/jf"
            }
        },
        "Features-available":{
            element: "ol",
            name: "features",
            date: {
            	element: "span",
            	text: "You can use functions to set values, like date: " + Date()
            }
        }
    }
}

Creator(document.body,home);
