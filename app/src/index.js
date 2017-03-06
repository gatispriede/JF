const home = {
	element: "div",
	id: "about",
	title: {
		element: "h3",
		text: "Hello I'm Gatis Priede",
		style: {
			display: "inline-block"
		},
		custommargin: function (element) {
			const pos = element.getBoundingClientRect().width / element.parentNode.getBoundingClientRect().width * 100 / 2;
			element.style.marginLeft = 50 - pos + "%";
		}
	},
	description: {
		element: "h2",
		text: "Web crossplatform developer",
		style: {
			display: "inline-block"
		},
		custommargin: function (element) {
			const pos = element.getBoundingClientRect().width / element.parentNode.getBoundingClientRect().width * 100 / 2;
			element.style.marginLeft = 50 - pos + "%";
		}
	},
	info: {
		element: "p",
		text: "sampleText"
	}
};
console.log(window.Creator);
window.Creator(document.body, home);