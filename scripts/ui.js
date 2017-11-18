import * as Keys from "./keys.js";
import { KEY_TYPE } from "./keys.js";

const ui = {
	keys: "#calc-keys"
};

export const onKeyPressed = [];

function keyPress(keyPressed) {
	onKeyPressed.forEach(function (handler) {
		if (typeof (handler) === "function")
			handler(keyPressed);
	});
}

export function bindUI() {
	const table = document.querySelector(ui.keys);
	const keys = Keys.keys;

	keys.forEach(function (row) {
		var tr = document.createElement("tr");
		row.forEach(function (key) {
			var td = document.createElement("td");
			var button = document.createElement("button");
			button.innerHTML = key.value;
			button.classList.add("keytype-" + KEY_TYPE[key.type]);
			td.style.backgroundColor = key.colors[2];
			if (key.size !== 1)
				td.colSpan = key.size;

			button.onclick = function () {
				keyPress(key);
			}

			td.appendChild(button);
			tr.appendChild(td);
		});

		table.appendChild(tr);
	});
}

export function getDisplay() {
	return document.querySelector("#calc-display");
}