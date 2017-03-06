import {Creator, JFstyle} from "jfjs";

const home = {
	element: 'div',
	id: 'navigation',
	style: {
		width: '100%',
		'min-height': '50px'
	},
	buttons: {
		customfunc: function (element) {
			for (let id in element.children) {
				let button = element.children[id];
				if (button instanceof HTMLElement) {
					button.onmouseover = function () {
						this.classList.add('hover');
					};
					button.onmouseout = function () {
						this.classList.remove('hover');
					};
					button.onclick = function () {
						if (element.lastItem !== undefined) {
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
		element: "div",
		class: "div",
		style: {
			float: "left",
			width: "100%"
		},
		home: {
			element: "button",
			text: "about",
			style: {
				border: "none",
				width: "25%",
				padding: "2px",
				transition: "background ease 1s",
				"border-radius": "1px",
				"text-transform": "uppercase"
			},
		},
		pictures: {
			element: "button",
			text: "pictures"
		},
		programmings: {
			element: "button",
			text: "programming"
		},
		contacts: {
			element: "button",
			text: "contacts"
		}
	}
};

Creator(document.body, home);