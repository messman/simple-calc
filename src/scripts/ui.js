import * as Keys from "./keys.js";

// UI bindings
export const ui = {
	keys: "#calc-keys",
	display: "#calc-display"
};

// Add custom keypress listeners
export const onKeyPressed = [];
function keyPress(keyPressed) {
	onKeyPressed.forEach(function (handler) {
		if (typeof (handler) === "function")
			handler(keyPressed);
	});
}

// When everything is loaded, bind the UI for the keys
export function bindUIOnReady() {
	const table = document.querySelector(ui.keys);
	const keys = Keys.keys;

	const flat = {};

	// Add the keys to the page row by row
	keys.forEach(function (row) {

		const tr = document.createElement("tr");

		row.forEach(function (key) {
			// Add the background color on the TD instead, the button is slightly smaller.
			const td = document.createElement("td");
			td.style.backgroundColor = key.colors.button;
			const button = document.createElement("button");

			button.innerHTML = key.value;
			button.classList.add("keytype-" + Keys.KEY_TYPE[key.type]);

			// For the "0", stretch the width
			if (key.size !== 1)
				td.colSpan = key.size;

			// When clicked, trigger
			button.onclick = function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				keyPress(key);
			}

			td.appendChild(button);
			tr.appendChild(td);

			// Also add to the lookup table for keypress
			flat[key.keyName] = key;
		});

		table.appendChild(tr);
	});

	const display = document.querySelector(ui.display);
	display.addEventListener("keypress", function (e) {
		const keyPressed = flat[e.key.toLowerCase()];
		if (keyPressed) {
			keyPress(keyPressed);
		}
		e.preventDefault();
		e.stopImmediatePropagation();
	});
}

// Update the display
export function updateDisplay(key) {
	const display = document.querySelector(ui.display);

	if (!key) {
		display.innerHTML = "";
		return;
	}

	var span = document.createElement("span");
	span.innerHTML = key.value;
	span.style.color = key.colors.display;

	const numChildren = display.children.length;
	const index = -1;
	if (index === -1 || index > numChildren - 1) {
		display.appendChild(span);
	}
	else {
		display.insertBefore(span, display.children[index]);
	}
	display.focus();
}