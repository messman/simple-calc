// keys.js
// Data on individual keys and colors

// Type of key (for maths, later?)
export const KEY_TYPE = {
	number: 0,
	mark: 1,
	parens: 2,
	operator: 3,
	clear: 4,
	equals: 5
}

// Borrow TypeScript's enum.x = 1, enum[1] = x
const keytypekeys = Object.keys(KEY_TYPE);
keytypekeys.forEach(function (keytype) {
	KEY_TYPE[KEY_TYPE[keytype]] = keytype;
});

// Create the three colors based on the percent of the h-range of HSL
function pastelRange(percent) {
	// Pastel: HSL
	const h = (360 * percent).toFixed(1);
	return {
		canvas: `hsla(${h}, 70%, 65%, 1)`,
		button: `hsla(${h}, 70%, 90%, 1)`,
	};
};

export const keys = [
	// Top Row
	[
		["C", KEY_TYPE.clear, "c"],
		["(", KEY_TYPE.parens],
		[")", KEY_TYPE.parens],
		["=", KEY_TYPE.equals, "Enter"]
	],
	[
		[7, KEY_TYPE.number],
		[8, KEY_TYPE.number],
		[9, KEY_TYPE.number],
		["/", KEY_TYPE.operator]
	],
	[
		[4, KEY_TYPE.number],
		[5, KEY_TYPE.number],
		[6, KEY_TYPE.number],
		["*", KEY_TYPE.operator]
	],
	[
		[1, KEY_TYPE.number],
		[2, KEY_TYPE.number],
		[3, KEY_TYPE.number],
		["-", KEY_TYPE.operator]
	],
	[
		[0, KEY_TYPE.number, null, 2], // Double-width
		[".", KEY_TYPE.mark],
		["+", KEY_TYPE.operator]
	]
];

let total = 0;
keys.forEach(function (row) {
	total += row.length;
});
let index = 0;
keys.forEach(function (row) {
	for (let i = 0; i < row.length; i++) {
		index++;
		const key = row[i];
		row[i] = {
			value: key[0],
			type: key[1],
			keyName: key[2] || key[0],
			colors: pastelRange(index / total),
			size: key[3] || 1
		}
	}
});