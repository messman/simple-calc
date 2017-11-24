
const Invalid = 0 / 0;

const decimalMaxPrecision = 3;
function toString(result) {
	const num = parseFloat(result);
	if (isNaN(num))
		return num;
	const r = Math.pow(10, decimalMaxPrecision);
	return Math.round(num * r) / r;
}

export function calc(input) {
	let result;
	try {
		result = eval(input);
	}
	catch (e) {
		result = Invalid;
	}
	return toString(result);
}