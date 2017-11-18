import * as UI from "./ui.js";
import * as Draw from "./draw.js";
import { KEY_TYPE } from "./keys.js";

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	UI.bindUIOnReady();

	Draw.bindCanvas();

	UI.onKeyPressed.push(function (key) {
		Draw.update(key);

		switch (key.type) {
			case KEY_TYPE.clear:
				UI.updateDisplay(null);
				break;
			default:
				// Add the key to the display
				UI.updateDisplay(key);
				break;
		}
	});
});