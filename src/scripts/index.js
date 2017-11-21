import * as UI from "./ui.js";
import * as Draw from "./draw.js";
import { KEY_TYPE } from "./keys.js";
import * as Calculator from "./calculate.js";

// Calcualtor's current expression
let input = [];

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	UI.detectTouch();

	UI.bindUIOnReady();

	Draw.bindCanvas();

	UI.onKeyPressed.push(function (key) {
		Draw.update(key);

		if (!key) {
			// In case we backspaced
			UI.updateOutput(Calculator.calc(input));
			return;
		}

		switch (key.type) {
			case KEY_TYPE.clear:
				UI.updateDisplay(null);
				UI.updateOutput(null);
				input = [];
				break;
			default:
				// Add the key to the display
				UI.updateDisplay(key);
				input.push(key);
				UI.updateOutput(Calculator.calc(input));
				break;
		}
	});

	UI.updateOutput(null);

	UI.startupFocus();
});