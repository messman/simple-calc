import * as Keys from "./keys.js";
import * as Calculator from "./calculate.js";

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
function keyPress(keyPressed, isButton) {
	onKeyPressed.forEach(function (handler) {
		if (typeof (handler) === "function")
			handler(keyPressed, isButton);
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
			td.style.backgroundColor = key.colors.canvas;
			td.style.color = key.colors.button;
			//td.style.boxShadow = `0 0 15px 3px ${key.colors.button} inset`;

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
				keyPress(key, true);
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
		console.log(e.key, keyPressed);
		if (keyPressed) {
			e.preventDefault();
			e.stopImmediatePropagation();
		}
		keyPress(keyPressed, false);
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

export function update(key, isButton) {
	const display = document.querySelector(ui.displayInput);
	const output = document.querySelector(ui.output);

	let updateDisplay = false;
	let newOutput, newDisplay;

	if (key) {
		switch (key.type) {
			case Keys.KEY_TYPE.clear:
				updateDisplay = true;
				newDisplay = "";
				newOutput = "";
				break;
			case Keys.KEY_TYPE.equals:
				updateDisplay = true;
				newDisplay = Calculator.calc(display.value);
				newOutput = newDisplay;
				break;
			default:
				// Add the key to the display
				if (isButton)
					updateDisplayFromKey(display, display.value, key);
				newOutput = Calculator.calc(display.value);
				break;
		}
	}
	else {
		// May be movement, delete, backspace, etc
		newOutput = Calculator.calc(display.value);
		updateDisplay = false;
	}

	setOutput(output, newOutput);
	if (updateDisplay)
		setDisplay(display, newDisplay);
}

// Update the display
function updateDisplayFromKey(display, displayValue, key) {
	let index = getCursorPosition(display);
	if (index === -1)
		index = displayValue.length;

	const before = displayValue.substring(0, index);
	const after = displayValue.substring(index);
	const newVal = before + key.value + after;
	display.value = newVal;

	setCursorPosition(false, display, index + 1);
}

export function initOutput() {
	setOutput(document.querySelector(ui.output), "");
}

// Set the output (to the result)
function setOutput(output, value) {
	output.innerHTML = value;
	output.style.visibility = value ? "" : "hidden";
}

// Set the display (to the result)
function setDisplay(display, value) {
	if (isNaN(value))
		value = "";
	display.value = value;
	setCursorPosition(false, display, value.toString().length);
}

export function startupFocus() {
	if (isTouch)
		return;
	const displayInput = document.querySelector(ui.displayInput);
	displayInput.focus();
}