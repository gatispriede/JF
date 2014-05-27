Welcome to "JF" javascript system

### Overall ###

* Allows to create html from JSON type input with javascript
* Version = BETA

### Getting started ###

download and include JF js into HEAD
<script src="js/JF.js" type="application/x-javascript" defer></script>

### RULES ###


```
#!HTML

1. template object **MUST** have element String attribute ("div","span","li".etc.)
2. template main element should have ID or uniq number will be provided

Additional fields:
style = creates style for this object within JFstyle object
inlineStyle = creates inline style for DOM element
name = used for filling template from external source
text = creates textNode for HTMLelement
```


### Available fucntions/features ###


```
#!HTML

Creator(TARGET,input) function = creates template form input, if target provided it will append it.
Creator.fillTemplate(JSON,template) function  = updates template with JSON input from template name attribute is used to update values within template form JSON key.
Creator.indexHtml(HTMLelement) function = creates template object from actual HTML on page.
JF.stringify(input) function = makes string from input.

JFstyle Object = holds dynamic style for templates.
JF.templates Object = holds all created templates.
JF.mouse Object = holds mouse live properties.
JF.touch Object = holds touch live properties.
```


### Help ###

Each JF.templates object holds 4 obejcts:

1. elements = all live elements on the template in a array access
2. name = name of template
3. html = live html for the template
4. template = JSON template

Available events on template objects = http://en.wikipedia.org/wiki/DOM_events
template.index.js holds examples

*TO BE UPDATED*

### Future updates ###
DragNdrop functionality

### Licence ###
Copyright (C) 2014 Funisimo

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.