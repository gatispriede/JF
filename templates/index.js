var resizer = {
    element: 'div',
    id: "resizer",
    style: {
        margin: "auto",
        "padding-left": "10%",
        "padding-right": "10%"
    },
    viewsWrapper:{
        element: "div",
        class: "resize_wrapper",
        mobilePortrait: {
            style: {
                cursor: "pointer",
                background: "gray",
                color: "white",
                "border-radius": "5px",
                padding: "2px",
                margin: "2px"
            },
            element: "a",
            text: "Mobile portrait (320x480)",
            onclick: function(){JF.containerController.setSize('320px','480px')}
        },
        mobileLandscape: {
            element: "a",
            text: "Mobile landscape (480x320)",
            onclick: function(){JF.containerController.setSize('480px','320px')}
        },
        smallTabletPortrait: {
            element: "a",
            text: "Small tablet portrait (600x800)",
            onclick: function(){JF.containerController.setSize('600px','800px')}
        },
        smallTabletLandscape: {
            element: "a",
            text: "Small tablet landscape (800x600)",
            onclick: function(){JF.containerController.setSize('800px','600px')}
        },
        tabletPortrait: {
            element: "a",
            text: "Tablet portrait (768x1024)",
            onclick: function(){JF.containerController.setSize('768px','1024px')}
        },
        tabletLandscape: {
            element: "a",
            text: "Tablet landscape (1024x768)",
            onclick: function(){JF.containerController.setSize('1024px','768px')}
        }
    }
}
var page = {
    element: 'div',
    id: "page",
    style: {
        margin: "10%",
        background: "gray",
        border: "1px solid black",
        width: window.outerWidth * 0.8 + "px",
        height: window.outerHeight * 0.8 + "px"
    }
}
var leftSidebar = {
    element: "div",
    id: "left-sidebar",
    style: {
        width: "150px",
        "padding-top": "0",
        position: "fixed",
        left: "0",
        top: "0",
        bottom: "0"
    },
    onmouseover: function(){JF.templates['left-sidebar'].elements.wrapper.style.display = 'block'},
    onmouseout: function(){JF.templates['left-sidebar'].elements.wrapper.style.display = 'none'},
    wrapper: {
        element: "div",
        class: "wrapper",
        style: {
            display: 'none'
        },
        image: {
            element: "div",
            text: "image"
        },
        text: {
            element: "div",
            text: "text",
            dragging: true
        },
        list: {
            element: "div",
            text: "list"
        },
        form: {
            element: "div",
            text: "form"
        },
        container: {
            element: "div",
            text: "container"
        },
        button: {
            element: "div",
            text: "button"
        }
    }
}
var rightSidebar = {
    element: "div",
    id: "right-sidebar",
    style: {
        width: "300px",
        "padding-top": "0",
        position: "fixed",
        right: "0",
        top: "0",
        bottom: "0"
    },
    onmouseover: function(){JF.templates['right-sidebar'].elements.wrapper.style.display = 'block'},
    onmouseout: function(){JF.templates['right-sidebar'].elements.wrapper.style.display = 'none'},
    wrapper: {
        element: "div",
        class: "wrapper",
        style: {
            display: "none"
        },
        image: {
            element: "div",
            text: "image"
        }
    }
}
Creator(document.body,resizer,leftSidebar,page,rightSidebar);

JF.containerController = {
    self: JF.templates.page.html,
    setSize: function(width,height){
        this.self.style.width = width;
        this.self.style.height = height;
    }
}