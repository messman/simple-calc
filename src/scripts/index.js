import * as UI from "./ui.js";
import * as Draw from "./draw.js";

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	UI.detectTouch();

	UI.bindUIOnReady();

	Draw.bindCanvas();

	UI.onKeyPressed.push(function (key, isButton) {
		Draw.update(key);
		UI.update(key, isButton);
	});

	UI.initOutput(null);

	UI.startupFocus();
});