JF
==

Javascript framework / library - all in one JS,HTML,STYLE.

Welcome to JF.js
=

JF is Framework / Library all in one place.
JF works with json type of structured javascript objects and converts that into HTML5.
You can create rich templates which after JF execution creates HTML with JS and even with style.
All that you need to work with JF framework is to add JF file, no other dependencies.

Advantages
=

1. All in one template - js, html, style
2. Simple usage
3. Simple markup - JSON type
4. Native code
5. Fastest html builder ever created
6. Template accepts functions
7. No Selector framework is need (example: jQuery) is needed because all templates arr linked within javscript in JF.templates array

Basic Template object
=

sample = {
    element: "div",
    id: "sampleId",
    class: "sampleClass",
    text: "Sample text"
}

Will create: < div class="sampleClass" id="sampleId">Sample text</div>"

Basic Usage
=

Creator(document.body,sample)

What it did?

1. Appended to document.body Element the templates resulting HTML
2. Create above template and stored the template in JF.templates array with following ID as a key.
3. Created JF.templates.sampleId Object containing:
    cssRules:       Array[]         linked rules if template has any, they are stored within JFstyle object
    elements:       Object          all create elements within template html
    funcArr:        Array[]         all custom functions
    html:           HTMLElement     linked html itself
    name:           "sampleId"      defined ID or generated ID if no specified
    remove:         function        remove function - should be used to completely remove template with all dependencies
    template:       Object          the template object itself with which the template was created

Usage Description
=

There are 3 global javascript functions: "Creator", "JFstyle" and "Controller" which handles actions for template objects

Creator(HTMLElement $target, Object $template1, Object $template2, ...., Object $templateN)
Is responsible for taking a template and creating html

    $target                   target HTML element on which appendChild method will be called after creating template
    $template1...$templateN   Templates from which the html will be created

returns Array with created templates

Controller(String $name, String $action, Function $function, Boolean $bool)
Is responsible for creating simple interaction between templates

    $name         name of route
    $action       action to be called or queued 
    $function     function which will be executed
    $bool         true/false parameter for the function to be deleted after execution

returns true / false

JFstyle 
Holds all css styles for templates

has 1 function .addStyle(String $style)

returns true / false

Advanced examples
=

`sampleObject = {
  element: "div",
  id: "about",
  title: {
  	element: "h3",
    text: "Hello I'm Gatis Priede",
    style: {
      	display: "inline-block"
    },
    custommargin: function(element){
    	var pos = element.getBoundingClientRect().width / element.parentNode.getBoundingClientRect().width * 100 / 2;
      element.style.marginLeft = 50 - pos + "%";
    }
  },
  description: {
  	element: "h2",
    text: "Web crossplatform developer",
    style: {
		display: "inline-block"
    },
    custommargin: function(element){
    	var pos = element.getBoundingClientRect().width / element.parentNode.getBoundingClientRect().width * 100 / 2;
        element.style.marginLeft = 50 - pos + "%";
    }
  },
  info:{
  	element: "p",
        text: "sampleText"
  }
}`

After execution will result in

`< div id="about">
< h3 style="margin-left: 24.6463677775114%;">Hello I'm Gatis Priede</h3>
< h2 style="margin-left: 7.23704490187348%;">Web crossplatform developer</h2>
< p>sampleText</p>
</div>`

Simple navigation example

`sampleNavigation = {
  element:'div',
  id:'navigation',
  style:{
    width:'100%',
    'min-height':'50px'
  },
  buttons:{
    customfunc: function(element){
      for(var id in element.children){
        var button = element.children[id];				
        if(button instanceof HTMLElement){
            button.onmouseover = function(){
              this.classList.add('hover');
            }
            button.onmouseout = function(){
              this.classList.remove('hover');
            }
            button.onclick = function(){
              if(element.lastItem !== undefined){
              	element.lastItem.remove('active');
              }
              this.classList.add('active');
              element.lastItem = this.classList;
            }
          }
      }
      JFstyle.addStyle('.active { color: white; background: rgb(200, 200, 200);}');
          	JFstyle.addStyle('.hover { color: rgb(122, 122, 122); background: white;}');
    },
    element:"div",
    class: "div",
    style:{
      float:"left",
      width:"100%"
    },
    home:{
      element:"button",
      text:"about",
      style:{
        border:"none",
        width:"25%",
        padding:"2px",
        transition: "background ease 1s",
        "border-radius":"1px",
        "text-transform": "uppercase"
      },
    },
    pictures:{
      element:"button",
      text:"pictures"
    },
    programmings:{
      element:"button",
      text:"programming"
    },
    contacts:{
      element:"button",
      text:"contacts"
    }
  }
}`

Will result in:

`< div id="navigation">
    < div class="div">
        < button class="active">about</button>
        < button class="">pictures</button>
        < button class="">programming</button>
        < button>contacts</button>
    </div>
</div>`
