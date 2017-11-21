import * as Keys from "./keys.js";

// UI bindings
export const ui = {
	keys: "#calc-keys",
	displayInput: "#calc-display-input",
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
	displayInput.addEventListener("keyup", function (e) {
		const keyPressed = flat[e.key.toLowerCase()] || null;
		keyPress(keyPressed);

		console.log(e.key);
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

function setSelectionRange(focus, input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
		if (!focus)
			input.blur();
	}
	else {
		if (input.createTextRange) {
			// IE
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd("character", selectionEnd);
			range.moveStart("character", selectionStart);
			range.select();
		}
		if (focus)
			input.focus();
	}
}

function setCursorPosition(focus, input, pos) {
	setSelectionRange(focus, input, pos, pos);
}

// Update the display
export function updateDisplay(key) {
	const displayInput = document.querySelector(ui.displayInput);

	// If no key, clear the displays.
	if (!key) {
		displayInput.value = "";
		return;
	}

	let text = displayInput.value;
	let index = getCursorPosition(displayInput);
	if (index === -1)
		index = text.length;

	const before = text.substring(0, index);
	const after = text.substring(index);
	const newVal = before + key.value + after;
	displayInput.value = newVal;

	setCursorPosition(false, displayInput, index + 1);
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

export function startupFocus() {
	if (isTouch)
		return;
	const displayInput = document.querySelector(ui.displayInput);
	displayInput.focus();
}