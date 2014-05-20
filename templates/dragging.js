var draggable = {
	element: "div",
	class: "draggable",
	onmousedown: function(event){
		console.log('Drag Started!');
		this.style.position = 'absolute';
		console.log([this],this.offsetLeft)
		this.style.top = 50;
		this.style.left = 200;
	},
	onmouseup: function(event){
		this.style.position = 'relative';
		console.log('Drag ended!');
	},
	title: {
		element: 'h1',
		value: "Draggable element!"
	}
}
Creator(document.getElementsByTagName('body')[0], draggable)