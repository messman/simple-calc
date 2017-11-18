import * as UI from "./ui.js";
import * as Draw from "./draw.js";
import { KEY_TYPE } from "./keys.js";

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	UI.bindUIOnReady();

	Draw.bindCanvas();

	UI.onKeyPressed.push(function (key, position) {
		switch (key.type) {
			case KEY_TYPE.clear:
				UI.updateDisplay(null);
				Draw.clear();
				break;
			default:
				// Add the key to the display
				UI.updateDisplay(key);
				Draw.update(key, position);
				break;
		}
	});
});