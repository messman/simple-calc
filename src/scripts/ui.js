import * as Keys from "./keys.js";

// UI bindings
export const ui = {
	keys: "#calc-keys",
	displayInput: "#calc-display-input",
	display: "#calc-display",
	output: "#calc-output",
};

// Check for touch events
let isTouch = false;
export function detectTouch() {
	isTouch = "ontouchstart" in document.documentElement;
}

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
			td.onclick = function (e) {
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

	const displayInput = document.querySelector(ui.displayInput);
	displayInput.addEventListener("keypress", function (e) {
		const keyPressed = flat[e.key.toLowerCase()];
		if (keyPressed) {
			keyPress(keyPressed);
		}
		e.preventDefault();
		e.stopImmediatePropagation();
	});
}

function getCursorPosition(el) {
	if ("selectionStart" in el) {
		// Standard-compliant browsers
		return el.selectionStart;
	}
	else if (document.selection) {
		// IE
		el.focus();
		const selection = document.selection.createRange();
		const selectionLength = document.selection.createRange().text.length;
		selection.moveStart("character", -el.value.length);
		return selection.text.length - selectionLength;
	}
	return -1;
}

function setSelectionRange(isTouch, input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
		if (isTouch)
			input.blur();
	}
	else if (input.createTextRange) {
		// IE
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd("character", selectionEnd);
		range.moveStart("character", selectionStart);
		range.select();
		if (!isTouch)
			input.focus();
	}
}

function setCursorPosition(isTouch, input, pos) {
	setSelectionRange(isTouch, input, pos, pos);
}

// Update the display
export function updateDisplay(key) {
	const display = document.querySelector(ui.display);
	const displayInput = document.querySelector(ui.displayInput);

	if (!key) {
		display.innerHTML = "";
		displayInput.value = "";
		return;
	}

	var span = document.createElement("span");
	span.innerHTML = key.value;
	span.style.color = key.colors.display;

	const numChildren = display.children.length;
	let index = getCursorPosition(displayInput);
	if (index === -1)
		index = numChildren;

	if (index === numChildren)
		display.appendChild(span);
	else
		display.insertBefore(span, display.children[index]);


	let text = displayInput.value;
	const before = text.substring(0, index);
	const after = text.substring(index);
	const newVal = before + " " + after;
	displayInput.value = newVal;

	setCursorPosition(isTouch, displayInput, index + 1);
}

export function updateOutput(result) {
	const output = document.querySelector(ui.output);
	if (result === null) {
		output.innerHTML = "";
		output.style.visibility = "hidden";
		return;
	}
	output.style.visibility = "";
	output.innerHTML = result;
}