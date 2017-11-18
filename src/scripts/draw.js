// All the keys we will need to draw in the canvas.
let keysToDraw = [];
// Keep track of total keys, as we will clear the array above
let allKeysPressed = 0;

// When we started the app.
const appStartTime = Date.now();

// The canvas we will draw to.
let canvas = null;
let canvasWidth = 0;
let canvasHeight = 0;
function resize() {
	canvasWidth = window.innerWidth;
	canvas.width = canvasWidth;
	canvasHeight = window.innerHeight;
	canvas.height = canvasHeight;
};
window.onresize = resize;

export function bindCanvas() {
	canvas = document.getElementById("background");
	resize();
}

// Track if we are in the requestAnimationFrame loop or not
let isDrawing = false;
// New keys will be animated in.
let newKeyAnimationStart = -1;
let newKeyAnimationTimeout = 100; //ms

// Accept new keys
export function update(newKey) {

	newKeyAnimationStart = Date.now();

	keysToDraw.push({
		key: newKey,
		totalIndex: allKeysPressed++,
		random: Math.random()
	});

	if (!isDrawing)
		animate();
}

// The animation loop
function animate() {
	isDrawing = true;

	// Figure out if we'll need to draw again
	let keepDrawing = false;

	const now = Date.now();
	const totalElapsed = now - appStartTime;

	// Check on the state of new key animation
	let isNewKeyAnimationCompleted = newKeyAnimationStart === -1;
	if (!isNewKeyAnimationCompleted) {
		// Check how far along the animation is
		const newKeyAnimationElapsed = now - newKeyAnimationStart;
		isNewKeyAnimationCompleted = newKeyAnimationElapsed > newKeyAnimationTimeout;
		// If not completed, draw the animation at its current point
		if (isNewKeyAnimationCompleted)
			newKeyAnimationStart = -1;
		else
			keepDrawing = draw(newKeyAnimationElapsed / newKeyAnimationTimeout, totalElapsed);
	}

	// Otherwise if completed, draw the normal animation
	if (isNewKeyAnimationCompleted)
		keepDrawing = draw(1, totalElapsed);

	// If true, we have keys that aren't cleared that we should draw
	if (keepDrawing) {
		requestAnimationFrame(animate);
	}
	else {
		// Be done drawing, signal that this function will need to be called manually again.
		isDrawing = false;
	}
}

// How large a ring is
const ringRadius = 100;


// Returns a boolean of whether or not drawing should occur; if true, draws.
function draw(newKeyAnimationPercent, totalElapsed) {

	// Clear the canvas
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// If no keys, get outta here
	if (!keysToDraw.length)
		return false;

	// Get our calculator position on the screen
	const rect = document.getElementById("calc").getBoundingClientRect();
	const width = rect.width;
	var middle = {
		x: rect.left + (width / 2),
		y: rect.top + (rect.height / 2)
	};

	// Figure out the (diagonal) radius of our window (which is the canvas size).
	const windowRadius = Math.sqrt(Math.pow(canvasWidth / 2, 2) + Math.pow(canvasHeight / 2, 2));
	// Only keep enough keys to draw just past the diagonal of the screen, to conserve memory.
	const keysToKeep = Math.ceil(windowRadius / ringRadius) + 1;
	const diff = keysToDraw.length - keysToKeep;
	if (diff > 0) {
		keysToDraw.splice(0, diff);
	}

	const length = keysToDraw.length;
	if (length === 0)
		return false;

	for (let i = 0; i < length; i++)
		drawSingle(ctx, keysToDraw[i], i, length, middle, newKeyAnimationPercent, totalElapsed);
	return true;
}

const TWO_PI = Math.PI * 2;
// The time it takes to rotate the ring
const blockPeriod = 60000;
// Size of the block represents how many ms of time?
const blockSize = 1000;
// Size of the block in radians
const blockSizeRadians = blockSize / blockPeriod * TWO_PI;

function drawSingle(ctx, keyEntry, index, length, middle, newKeyAnimationPercent, totalElapsed) {

	// Value of the key
	const value = keyEntry.key.value;
	// Colors of the key
	const colors = keyEntry.key.colors;
	// Total index (not index in array)
	const { totalIndex, random } = keyEntry;

	// The radius of this ring may be different if we are animating a new key
	const radius = ringRadius * (length - index - (1 - newKeyAnimationPercent));

	// Draw the circle/ring
	ctx.fillStyle = colors.canvas;
	ctx.beginPath();
	ctx.arc(middle.x, middle.y, radius, 0, TWO_PI);
	ctx.closePath();
	ctx.fill();

	// Now draw the block that will rotate.

	// Direction (clockwise or counter) depends on the *total* index.
	const clockwise = totalIndex % 2 === 0;

	// Compute the angle of the block's side.
	const blockRotation = ((totalElapsed % blockPeriod) / blockPeriod + random) * (clockwise ? 1 : -1) * TWO_PI;
	const blockRotationNext = blockSizeRadians * (clockwise ? -1 : 1);

	// Draw an arc (pizza slice) out from the middle
	ctx.fillStyle = colors.display;
	ctx.beginPath();
	ctx.moveTo(middle.x, middle.y);
	ctx.lineTo(middle.x + (Math.cos(blockRotation) * radius), middle.y + (Math.sin(blockRotation) * radius));
	ctx.arc(middle.x, middle.y, radius, blockRotation, blockRotation + blockRotationNext, clockwise);
	ctx.closePath();
	ctx.fill();

	// Compute the line distance between the two furthest points of our slice block.
	const pt1x = Math.cos(blockSizeRadians) * radius;
	const pt1y = Math.sin(blockSizeRadians) * radius;
	const distance = Math.sqrt(Math.pow(radius - pt1x, 2) + Math.pow(0 - pt1y, 2));

	// Draw the value of the key.
	ctx.save();
	ctx.translate(middle.x, middle.y);
	const rotation = (((blockRotation + blockRotation + blockRotationNext) / 2) - (Math.PI / 2)) % (TWO_PI)
	ctx.rotate(rotation);
	ctx.translate(0, radius);
	ctx.fillStyle = colors.canvas;
	ctx.font = `${Math.min(distance, ringRadius) / 2}px "Courier New", "Courier", monospace`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(value, 0, -ringRadius / 2);
	ctx.restore();
}
