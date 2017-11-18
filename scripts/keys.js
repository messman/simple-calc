export const KEY_TYPE = {
	number: 0,
	mark: 1,
	parens: 2,
	operator: 3,
	clear: 4,
	equals: 5
}
const keytypekeys = Object.keys(KEY_TYPE);
keytypekeys.forEach(function (keytype) {
	KEY_TYPE[KEY_TYPE[keytype]] = keytype;
});

function pastelRange(percent) {
	// Pastel: HSL
	const h = 360 * percent;
	// canvas, display, button
	const l = [60, 75, 75];
	const a = [1, .9, .9];
	const colors = [];
	for (let i = 0; i < l.length; i++)
		colors.push(`hsla(${h.toFixed(1)}, 70%, ${l[i].toFixed(1)}%, ${a[i]})`);
	return colors;
}

export const keys = [
	// Top Row
	[
		["C", KEY_TYPE.action],
		["(", KEY_TYPE.parens],
		[")", KEY_TYPE.parens],
		["/", KEY_TYPE.operator]
	],
	[
		[7, KEY_TYPE.number],
		[8, KEY_TYPE.number],
		[9, KEY_TYPE.number],
		["*", KEY_TYPE.operator]
	],
	[
		[4, KEY_TYPE.number],
		[5, KEY_TYPE.number],
		[6, KEY_TYPE.number],
		["-", KEY_TYPE.operator]
	],
	[
		[1, KEY_TYPE.number],
		[2, KEY_TYPE.number],
		[3, KEY_TYPE.number],
		["+", KEY_TYPE.operator]
	],
	[
		[0, KEY_TYPE.number, 2], // Double-width
		[".", KEY_TYPE.mark],
		["=", KEY_TYPE.equals]
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
		const pastelRanges = pastelRange(index / total);
		row[i] = {
			value: key[0],
			type: key[1],
			colors: pastelRanges,
			size: key[2] || 1
		}
	}
});