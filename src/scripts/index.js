import * as UI from "./ui.js";
import { KEY_TYPE } from "./keys.js";

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	UI.bindUI();

	UI.onKeyPressed.push(function (key) {
		console.log(key);
	});

	const canvas = document.getElementById("background");

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
	window.onresize = resize;
	resize();

	const display = UI.getDisplay();


	let canvasEntriesCount = 0;
	const canvasEntries = [];
	UI.onKeyPressed.push(function (key) {


		switch (key.type) {
			case KEY_TYPE.clear:
				display.innerHTML = "";
				break;
			default:
				var span = document.createElement("span");
				span.innerHTML = key.value;
				span.style.color = key.colors[1];
				display.appendChild(span);
				break;
		}

		completed = false;
		start = Date.now();
		canvasEntries.push([key.value, key.colors, canvasEntriesCount++, start - totalStart, Math.random()]);
	});

	const totalStart = Date.now();

	let completed = true;
	let timeout = 100;
	let start = -1;
	function animate() {

		const now = Date.now();
		const totalElapsed = now - totalStart;
		if (!completed) {
			const animationElapsed = now - start;
			if (animationElapsed < timeout) {
				draw(animationElapsed / timeout, totalElapsed);
			}
			else {
				completed = true;
			}
		}
		if (completed) {
			draw(1, totalElapsed);
		}

		requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);

	function draw(percent, totalElapsed) {
		const rect = document.getElementById("calc").getBoundingClientRect();
		const width = rect.width;
		var middle = {
			x: rect.left + (width / 2),
			y: rect.top + (rect.height / 2)
		};

		const radius = 100;

		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);


		const windowRadius = Math.sqrt(Math.pow(window.innerWidth / 2, 2) + Math.pow(window.innerHeight / 2, 2));
		const entriesToKeep = Math.ceil(windowRadius / radius) + 1;
		const entryDiff = canvasEntries.length - entriesToKeep;
		if (entryDiff > 0) {
			canvasEntries.splice(0, entryDiff);
		}

		const length = canvasEntries.length;

		canvasEntries.forEach(function (entry, i) {
			const value = entry[0];
			const colorSet = entry[1];
			const totalIndex = entry[2];
			const elapsed = entry[3] + totalElapsed;
			const random = entry[4] * Math.PI * 2;

			const thisRadius = radius * (length - i - (1 - percent));

			// Draw the circle
			ctx.fillStyle = colorSet[0];
			ctx.beginPath();
			ctx.arc(middle.x, middle.y, thisRadius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();

			const direction = totalIndex % 2 === 0;
			const directionFlip = direction ? 1 : -1;
			const period = 60000;
			const offset = (elapsed % period) * directionFlip / period * Math.PI * 2 + random;
			const fudge = 1000;
			const nextOffset = ((elapsed + (direction ? fudge : -fudge)) % period) * directionFlip / period * Math.PI * 2 + random;

			ctx.fillStyle = colorSet[1];
			ctx.beginPath();
			ctx.moveTo(middle.x, middle.y);
			ctx.lineTo(middle.x + (Math.cos(offset) * thisRadius), middle.y + (Math.sin(offset) * thisRadius));
			ctx.arc(middle.x, middle.y, thisRadius, offset, nextOffset);
			ctx.closePath();
			ctx.fill();

			const angleDiff = Math.PI * 2 * (fudge / period);
			const pt1x = Math.cos(angleDiff) * thisRadius;
			const pt1y = Math.sin(angleDiff) * thisRadius;
			const distance = Math.sqrt(Math.pow(thisRadius - pt1x, 2) + Math.pow(0 - pt1y, 2));

			ctx.save();
			ctx.translate(middle.x, middle.y);
			var rotation = (((offset + offset + angleDiff) / 2) - (Math.PI / 2)) % (Math.PI * 2)
			ctx.rotate(rotation);
			ctx.translate(0, thisRadius);
			ctx.fillStyle = colorSet[0];
			ctx.font = `${Math.min(distance, radius) / 2}px "Courier New", "Courier", monospace`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(value, 0, -radius / 2);
			ctx.restore();
		});
	}
});