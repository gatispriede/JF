import JF from "./src";

const home = {
	element: 'div',
	id: 'navigation',
	style: {
		width: '100%',
		'min-height': '50px'
	},
	buttons: {
		customfunc(element) {
			for (const id in element.children) {
				const button = element.children[id];
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
					};
				}
			}
			console.log(JF.style);
			JF.addStyle('.active { color: white; background: rgb(200, 200, 200);}');
			JF.addStyle('.hover { color: rgb(122, 122, 122); background: white;}');
		},
		element: 'div',
		class: 'div',
		style: {
			float: 'left',
			width: '100%'
		},
		home: {
			element: 'button',
			text: 'about',
			style: {
				border: 'none',
				width: '25%',
				padding: '2px',
				transition: 'background ease 1s',
				'border-radius': '1px',
				'text-transform': 'uppercase'
			},
		},
		pictures: {
			element: 'button',
			text: 'pictures'
		},
		programmings: {
			element: 'button',
			text: 'programming'
		},
		contacts: {
			element: 'button',
			text: 'contacts'
		}
	}
};

JF(document.body, home);