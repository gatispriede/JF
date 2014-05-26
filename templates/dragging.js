var draggable = {
	id: "new",
	element: "div",
	class: "draggable",
	onmousedown: function(event){
	},
	onmouseup: function(event){
	},
	title: {
		element: 'h1',
		text: "Draggable element!",
		custom: console.log('cool')//this.getClientRects()
	}
}
Creator(document.body, draggable);